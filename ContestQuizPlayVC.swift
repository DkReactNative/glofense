//
//  SingleQuizPlayVC.swift
//  QuizFantasy
//
//  Created by octal on 21/07/20.
//  Copyright © 2020 octal. All rights reserved.
//

import UIKit
import SocketIO
import Kingfisher
import AsyncTimer
import AVKit
import AVFoundation
import VersaPlayer

class ContestQuizPlayVC: UIViewController , VersaPlayerPlaybackDelegate
{
    @IBOutlet weak var tblView: UITableView!
    @IBOutlet weak var statusBarHeight: NSLayoutConstraint!

    @IBOutlet weak var progressBar: UIProgressView!
    
    @IBOutlet weak var lblTimerSec: UILabel!

    @IBOutlet weak var lblUser1Name: UILabel!
    @IBOutlet weak var User1Img: UIImageView!
    @IBOutlet weak var lblUser1Points: UILabel!
    @IBOutlet weak var User1PointView: UIView!

        
    @IBOutlet weak var ShowQuizWaitView: UIView!
    @IBOutlet weak var quizWaitTimer: UILabel!
    @IBOutlet weak var lblFindUser: UILabel!
    @IBOutlet weak var lblQuestions: UILabel!

    
    //*****//TextQuiz
    @IBOutlet weak var lblTextQuizQues: UILabel!
    @IBOutlet weak var TextQuizView: UIView!

    //*****//
    
    //*****//VideoQuiz
    @IBOutlet weak var lblVideoQuizQues: UILabel!
    @IBOutlet weak var videoPlayer: VersaPlayerView!
    @IBOutlet weak var VideoQuizView: UIView!
    //*****//
    
    //*****//AudioQuiz
    @IBOutlet weak var lblAudioQuizQues: UILabel!
    @IBOutlet weak var audioPlayer : VersaPlayerView!
    @IBOutlet weak var AudioQuizView: UIView!
    //*****//
    
    //*****//ImageQuiz
    @IBOutlet weak var lblImageQuizQues: UILabel!
    @IBOutlet weak var ImageQuizImg: UIImageView!
    @IBOutlet weak var ImageQuizView: UIView!
    //*****//
    
    var name: String?
    var resetAck: SocketAckEmitter?
    
    var section1RowCount = 0
    var section2RowCount = 0
    
    var sectionCount = 0
    
    var quizDetails:ContestDetails?
    var myContestDoc:MyContestListDoc?

    
    var otherUserName = ""
    var otherUserImageUrl = ""
    
    var currentCount = 0
    
    var saveLocalPoints = 0
    
    var rightWrongIndex = -1
    var selectedIndex = -1

    
    var saveLocalTotalRight = 0
    var saveLocalTotalWrong = 0
    var questionsData = [String:Any]()
    
    var defaultQuestionType = ""
    
    var questions = [QuestionResult]()
    
    private lazy var tenSecWaitTimer: AsyncTimer = {
        return AsyncTimer(
            interval: .milliseconds(1000),
            times: 30,
            block: { [weak self] value in
                self?.ShowQuizWaitView.isHidden = false
                self?.quizWaitTimer.text = value.description
                
            }, completion: { [weak self] in
                
                if self?.isOtherUserFound == true
                {
                    if self?.isQuestionsFound == true
                    {
                        self?.appDelegate.socket.emit("startContestGame",["match_id":"\(self?.myContestDoc?.id ?? "")","user_id":"\(defaults[.UserSaltId])"])
                        
                        matchStarted = true
                        userMatchID = self?.myContestDoc?.id ?? ""
                        
                        self?.defaultQuestionType = self?.questions[self!.currentCount].questionType ?? ""
                        
                        self?.isOtherUserFound = true
                        self?.isQuestionsFound = true
                        
                        self?.lblQuestions.text = "Q. 1/\(self?.questions.count ?? 0)"
                        self?.tenSecWaitTimer.stop()
                        self?.ShowQuizWaitView.isHidden = false
                        self?.lblFindUser.text = "Loading Questions"
                        self?.fiveSecWaitTimer.start()
                    }
                }
                else
                {
                    
                    self?.quizWaitTimer.text = "0"
                    self?.lblFindUser.text = "No User Found"
                    self?.ShowQuizWaitView.isHidden = false
                    
                    DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
                        // code to remove your view
                        self?.CloseViewController()
                    }
                }
                
            }
        )
    }()
    
    private lazy var fiveSecWaitTimer: AsyncTimer = {
        return AsyncTimer(
            interval: .milliseconds(1000),
            times: 5,
            block: { [weak self] value in
                self?.quizWaitTimer.text = value.description
                
                self?.selectedIndex = -1
                self?.rightWrongIndex = -1
                //print("value--->",value)
                
                if value == 3
                {
                    if self?.isOtherUserFound == true && self?.isQuestionsFound == true
                    {
                        if self?.currentCount ?? 0 < self?.questions.count ?? 0
                        {
                            self?.ShowQuizWaitView.isHidden = true
                            
                            if self?.defaultQuestionType == "audio"
                            {
                                self?.AudioQuizView.isHidden = false
                                self?.VideoQuizView.isHidden = true
                                self?.TextQuizView.isHidden = true
                                self?.ImageQuizView.isHidden = true
                                self?.lblAudioQuizQues.text = self?.questions[self?.currentCount ?? 0].questionEnglish ?? ""
                                
                                if let url = URL.init(string: "\(self?.questions[self?.currentCount ?? 0].questionFile ?? "")")
                                {
                                    print("AudiPlayingFile-->",url)
                                    let item = VersaPlayerItem(url: url)
                                    self?.audioPlayer.set(item: item)
                                    self?.audioPlayer.play()
                                }
                                
                                self?.sectionCount = 0
                                self?.section1RowCount = 0
                                self?.section2RowCount = 0
                                self?.tblView.reloadData()
                                
                                
                            }
                            else if self?.defaultQuestionType == "video"
                            {
                                self?.AudioQuizView.isHidden = true
                                self?.VideoQuizView.isHidden = false
                                self?.TextQuizView.isHidden = true
                                self?.ImageQuizView.isHidden = true
                                self?.lblVideoQuizQues.text = self?.questions[self?.currentCount ?? 0].questionEnglish ?? ""
                                
                                if let url = URL.init(string: "\(self?.questions[self?.currentCount ?? 0].questionFile ?? "")") {
                                    print("VideoPlayingFile-->",url)
                                    let item = VersaPlayerItem(url: url)
                                    self?.videoPlayer.set(item: item)
                                    self?.videoPlayer.play()
                                }
                                
                                self?.sectionCount = 0
                                self?.section1RowCount = 0
                                self?.section2RowCount = 0
                                self?.tblView.reloadData()
                                
                                
                            }
                            else if self?.defaultQuestionType == "image"
                            {
                                self?.AudioQuizView.isHidden = true
                                self?.VideoQuizView.isHidden = true
                                self?.TextQuizView.isHidden = true
                                self?.ImageQuizView.isHidden = false
                                self?.lblImageQuizQues.text = self?.questions[self?.currentCount ?? 0].questionEnglish ?? ""
                                
                                self?.sectionCount = 0
                                self?.section1RowCount = 0
                                self?.section2RowCount = 0
                                self?.tblView.reloadData()
                                
                            }
                            else
                            {
                                self?.AudioQuizView.isHidden = true
                                self?.VideoQuizView.isHidden = true
                                self?.TextQuizView.isHidden = false
                                self?.ImageQuizImg.isHidden = true
                                self?.lblTextQuizQues.text = self?.questions[self?.currentCount ?? 0].questionEnglish ?? ""
                                
                                self?.sectionCount = 0
                                self?.section1RowCount = 0
                                self?.section2RowCount = 0
                                self?.tblView.reloadData()
                                
                            }
                        }
                        
                    }
                }
                
            }, completion: { [weak self] in
                self?.quizWaitTimer.text = "0"
                self?.ShowQuizWaitView.isHidden = true
                self?.questionsData = [String:Any]()
                
                if self?.isOtherUserFound == true && self?.isQuestionsFound == true
                {
                    if self?.currentCount ?? 0 < self?.questions.count ?? 0
                    {
                        if self?.defaultQuestionType == "audio"
                        {
                            self?.sectionCount = 0
                            self?.section1RowCount = 0
                            self?.section2RowCount = 0
                            self?.tblView.reloadData()
                            
                            if self?.audioPlayer.isPlaying ?? false == false
                            {
                                if let url = URL.init(string: "\(self?.questions[self?.currentCount ?? 0].questionFile ?? "")")
                                {
                                    print("AudiPlayingFile-->",url)
                                    let item = VersaPlayerItem(url: url)
                                    self?.audioPlayer.set(item: item)
                                    self?.audioPlayer.play()
                                }
                                
                            }
                            else
                            {
                                self?.audioPlayer.play()
                            }
                        }
                        else if self?.defaultQuestionType == "video"
                        {
                            self?.sectionCount = 0
                            self?.section1RowCount = 0
                            self?.section2RowCount = 0
                            self?.tblView.reloadData()
                            
                            if self?.videoPlayer.isPlaying ?? false == false
                            {
                                if let url = URL.init(string: "\(self?.questions[self?.currentCount ?? 0].questionFile ?? "")")
                                {
                                    print("VideoPlayingFile-->",url)
                                    let item = VersaPlayerItem(url: url)
                                    self?.videoPlayer.set(item: item)
                                    self?.videoPlayer.play()
                                }
                                
                            }
                            else
                            {
                                self?.videoPlayer.play()
                            }
                            
                        }
                        else if self?.defaultQuestionType == "image"
                        {
                            self?.quizSecWaitTimer.start()
                            self?.sectionCount = 1
                            self?.section1RowCount = 1
                            self?.section2RowCount = 4
                            self?.tblView.reloadData()
                        }
                        else
                        {
                            self?.quizSecWaitTimer.start()
                            self?.sectionCount = 1
                            self?.section1RowCount = 1
                            self?.section2RowCount = 4
                            self?.tblView.reloadData()
                        }
                        
                    }
                    else
                    {
                        self?.progressBar.progress = 0.0
                        self?.lblTimerSec.text = ""
                        self?.ShowQuizWaitView.isHidden = false
                        self?.lblFindUser.text = "Please Wait Loading Results"
                        self?.sectionCount = 0
                        self?.section1RowCount = 0
                        self?.section2RowCount = 0
                        
                        self?.CallMatchCompleted()
                    }
                    
                }
                
            }
        )
    }()
    
    private lazy var quizSecWaitTimer: AsyncTimer = {
        return AsyncTimer(
            interval: .milliseconds(1000),
            times: 10,
            block: { [weak self] value in
                self?.lblTimerSec.text = "\(value.description) Sec"
                UIView.animate(withDuration: 1, animations: { () -> Void in
                    self?.progressBar.progress -= 0.1
                })
            }, completion: { [weak self] in

                if self!.currentCount != self?.questions.count ?? 0
                {
                    self?.LoadOtherQuestion()
                }
                
            }
        )
    }()
    
    var gameType = "Online"
    
    var isOtherUserFound = true
    var isQuestionsFound = true
    
    override func viewDidLoad()
    {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        
        self.statusBarHeight.constant = self.getStatusBarHeight()
        
        self.lblFindUser.text = "Waiting for opponents to join"
        
        self.appDelegate.socket = self.appDelegate.manager.defaultSocket
        
        
        
        self.appDelegate.socket.connect()
        
        //addHandlers()
        
        tblView.register(UINib(nibName: "TextQuestionTblCell", bundle: nil), forCellReuseIdentifier: "TextQuestionTblCell")

        tblView.register(UINib(nibName: "AudioQuestionTblCell", bundle: nil), forCellReuseIdentifier: "AudioQuestionTblCell")

        tblView.register(UINib(nibName: "VideoQuestionTblCell", bundle: nil), forCellReuseIdentifier: "VideoQuestionTblCell")

        tblView.register(UINib(nibName: "ImageQuestionTblCell", bundle: nil), forCellReuseIdentifier: "ImageQuestionTblCell")

        tblView.register(UINib(nibName: "AnswersTblCell", bundle: nil), forCellReuseIdentifier: "AnswersTblCell")

        self.tblView.tableFooterView = UIView()
        
        if self.gameType == "Online"
        {
            self.tenSecWaitTimer.start()
        }
        
        NotificationCenter.default.addObserver(self, selector: #selector(self.CallAppLocked(_:)), name: NSNotification.appLocked, object: nil)
        
        self.videoPlayer.playbackDelegate = self
        self.audioPlayer.playbackDelegate = self


        self.AudioQuizView.isHidden = true
        self.VideoQuizView.isHidden = true
        self.TextQuizView.isHidden = true
        self.ImageQuizView.isHidden = true
        
        self.SetupMyUI()
    }
    
    func playbackDidEnd(player: VersaPlayer)
    {
        print("Khtam ho gaya bhai")
        player.pause()
        
        self.quizSecWaitTimer.start()
        self.sectionCount = 1
        self.section1RowCount = 1
        self.section2RowCount = 4
        self.tblView.reloadData()
    }
    
    
    func SetupMyUI()
    {
        if defaults[.profilePic] != ""
        {
            if let url = URL(string:"\(defaults[.profilePic])") {
                self.User1Img.kf.setImage(with: url, placeholder: UIImage(named: "avatar"))
            }else {
                self.User1Img.image = UIImage.init(named: "avatar")
            }
        }
        else
        {
            self.User1Img.image = UIImage(named: "avatar")
        }
        
        self.lblUser1Name.text = defaults[.userTeamName]
        
    }
    
    
    func addHandlers()
    {
        self.appDelegate.socket.on("startGame_\(defaults[.UserSaltId])") {[weak self] data, ack in
            print("data--->",data)
            if data.count > 0
            {
                self?.isOtherUserFound = true
            }
            return
        }
    }
    
    
    func CloseViewController()
    {
        self.tenSecWaitTimer.stop()
        self.fiveSecWaitTimer.stop()
        self.quizSecWaitTimer.stop()
        //self.appDelegate.socket.disconnect()
        self.dismiss(animated: true, completion: nil)
    }
    
//    func disconnect() -> Self {
//        self.appDelegate.socket.removeAllHandlers()
//        self.appDelegate.manager.defaultSocket.disconnect()
//        return self
//    }

    
    
    override func viewWillAppear(_ animated: Bool)
    {
        super.viewWillAppear(animated)
        
        switch UIApplication.shared.applicationState {
        case .active:
            //app is currently active, can update badges count here
            break
        case .inactive:
            //app is transitioning from background to foreground (user taps notification), do what you need when user taps here
            self.tenSecWaitTimer.stop()
            self.fiveSecWaitTimer.stop()
            self.quizSecWaitTimer.stop()
            self.appDelegate.socket.emit("endContestGame",["match_id":"\(self.myContestDoc?.id ?? "")","user_id":"\(defaults[.UserSaltId])"])
            self.dismiss(animated: true, completion: nil)
            break
        case .background:
            //app is in background, if content-available key of your notification is set to 1, poll to your backend to retrieve data and update your interface here
            self.tenSecWaitTimer.stop()
            self.fiveSecWaitTimer.stop()
            self.quizSecWaitTimer.stop()
            self.appDelegate.socket.emit("endContestGame",["match_id":"\(self.myContestDoc?.id ?? "")","user_id":"\(defaults[.UserSaltId])"])
            self.dismiss(animated: true, completion: nil)
            break
        default:
            break
        }
        
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        switch UIApplication.shared.applicationState {
        case .active:
            //app is currently active, can update badges count here
            break
        case .inactive:
            //app is transitioning from background to foreground (user taps notification), do what you need when user taps here
            self.tenSecWaitTimer.stop()
            self.fiveSecWaitTimer.stop()
            self.quizSecWaitTimer.stop()
            self.appDelegate.socket.emit("endContestGame",["match_id":"\(self.myContestDoc?.id ?? "")","user_id":"\(defaults[.UserSaltId])"])
            self.dismiss(animated: true, completion: nil)
            break
        case .background:
            //app is in background, if content-available key of your notification is set to 1, poll to your backend to retrieve data and update your interface here
            self.tenSecWaitTimer.stop()
            self.fiveSecWaitTimer.stop()
            self.quizSecWaitTimer.stop()
            self.appDelegate.socket.emit("endContestGame",["match_id":"\(self.myContestDoc?.id ?? "")","user_id":"\(defaults[.UserSaltId])"])
            self.dismiss(animated: true, completion: nil)
            break
        default:
            break
        }
        
    }
    
    // MARK: - Notification Received
    
    @objc func CallAppLocked(_ notification: NSNotification)
    {
        self.appDelegate.socket.emit("endContestGame",["match_id":"\(self.myContestDoc?.id ?? "")","user_id":"\(defaults[.UserSaltId])"])
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1)
        {
            self.view.window!.rootViewController?.dismiss(animated: false, completion: {
                self.appDelegate.SetMainRootVC()
            })
        }
    }
    
    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */
    
    // MARK: - IBActions
    
    @IBAction func backBtnClicked(_ sender: Any)
    {
        let alert = UIAlertController(title: "Quit Game", message: "Are you sure you want to quit?", preferredStyle: .alert)

        alert.addAction(UIAlertAction(title: "Yes", style: .default, handler: { action in
            self.tenSecWaitTimer.stop()
            self.fiveSecWaitTimer.stop()
            self.quizSecWaitTimer.stop()
            if self.quizDetails?.results?.id ?? "" != ""
            {
                self.appDelegate.socket.emit("endContestGame",["match_id":"\(self.myContestDoc?.id ?? "")","user_id":"\(defaults[.UserSaltId])"])
            }
                        
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1)
            {
                self.view.window!.rootViewController?.dismiss(animated: false, completion: {
                    self.appDelegate.SetMainRootVC()
                })
            }
            
            
        }))
        alert.addAction(UIAlertAction(title: "No", style: .cancel, handler: nil))

        UIApplication.getTopMostViewController()?.present(alert, animated: true)

    }

}

//MARK: Check Timer
extension ContestQuizPlayVC
{
    func setProgress()
    {
       
    }
}

//MARK: - TableView
extension ContestQuizPlayVC : UITableViewDelegate, UITableViewDataSource
{
    func numberOfSections(in tableView: UITableView) -> Int
    {
        if self.currentCount < self.questions.count
        {
            return sectionCount
        }
        else
        {
            return 0
        }
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int
    {
//        if section == 0
//        {
//            return section1RowCount
//        }
//        else
//        {
            return section2RowCount
        //}
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell
    {
//        if indexPath.section == 0
//        {
//            let quesData = self.questionData?.questions?[currentCount]
//
//            switch quesData?.questionType ?? "" {
//             case "text":
//                let cellMatch =  tableView.dequeueReusableCell(withIdentifier: "TextQuestionTblCell", for: indexPath) as! TextQuestionTblCell
//                cellMatch.selectionStyle = .none
//                cellMatch.lblQuestion.text = quesData?.questionEnglish ?? ""
//
//                return cellMatch
//
//             case "audio":
//                let cellMatch =  tableView.dequeueReusableCell(withIdentifier: "AudioQuestionTblCell", for: indexPath) as! AudioQuestionTblCell
//                cellMatch.selectionStyle = .none
//
//                cellMatch.lblQuestion.text = ""
//
//                let url = URL(string: "https://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4");
//                let avPlayer = AVPlayer(url: url!);
//                cellMatch.playerView?.playerLayer.player = avPlayer;
//
//                return cellMatch
//
//             case "video":
//                let cellMatch =  tableView.dequeueReusableCell(withIdentifier: "VideoQuestionTblCell", for: indexPath) as! VideoQuestionTblCell
//                cellMatch.selectionStyle = .none
//                cellMatch.lblQuestion.text = ""
//
//                let url = URL(string: "https://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4");
//                let avPlayer = AVPlayer(url: url!);
//                cellMatch.playerView?.playerLayer.player = avPlayer;
//
//
//                return cellMatch
//             case "image":
//                let cellMatch =  tableView.dequeueReusableCell(withIdentifier: "ImageQuestionTblCell", for: indexPath) as! ImageQuestionTblCell
//                cellMatch.selectionStyle = .none
//
//                return cellMatch
//             default:
//                return UITableViewCell()
//            }
//        }
//        else
//        {
            let cellMatch =  tableView.dequeueReusableCell(withIdentifier: "AnswersTblCell", for: indexPath) as! AnswersTblCell
            cellMatch.selectionStyle = .none
            
            let quesData = self.questions[currentCount]
            
            if indexPath.row == 0
            {
                cellMatch.lblAnswer.text = quesData.firstOptionEnglish ?? ""
            }
            else if indexPath.row == 1
            {
                cellMatch.lblAnswer.text = quesData.secondOptionEnglish ?? ""
            }
            else if indexPath.row == 2
            {
                cellMatch.lblAnswer.text = quesData.thirdOptionEnglish ?? ""
            }
            else if indexPath.row == 3
            {
                cellMatch.lblAnswer.text = quesData.fourthOptionEnglish ?? ""
            }
            
            if self.rightWrongIndex == indexPath.row
            {
                cellMatch.backView.backgroundColor = UIColor(hexString: "237a1b")
                cellMatch.lblAnswer.textColor = .white
                cellMatch.answerCheck.image = UIImage(named: "checked")
            }
            else
            {
                if self.selectedIndex == indexPath.row
                {
                    cellMatch.backView.backgroundColor = UIColor(hexString: "B40901")
                    cellMatch.lblAnswer.textColor = .white
                    cellMatch.answerCheck.image = UIImage(named: "checked")
                }
                else
                {
                    cellMatch.lblAnswer.textColor = .black
                    cellMatch.backView.backgroundColor = .white
                    cellMatch.answerCheck.image = UIImage(named: "unchecked")
                }
            }
            return cellMatch
//        }
    }
    
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        
        switch indexPath.section {
        case 0:
            return 60
        case 1:
            return 60
        default:
            return UITableView.automaticDimension
        }
        
    }
    
    func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return 0
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath)
    {
        if indexPath.section == 0
        {
            let dataDict = self.questions[self.currentCount]
            
            self.questionsData = [String:Any]()
            
            switch dataDict.questionLanguage ?? "" {
             case "hindi_english":
                if dataDict.answerEnglish ?? "" == "first_option_english" && indexPath.row == 0
                {
                    self.saveLocalPoints += self.quizSecWaitTimer.value ?? 0
                    self.rightWrongIndex = indexPath.row
                    self.questionsData = ["question_id":dataDict.id ?? "",
                                          "answer_key":dataDict.answerEnglish ?? "",
                                          "user_answer_key":"first_option_english",
                                          "duration":"\(self.quizSecWaitTimer.value ?? 0)","result":"right"]
                    self.saveLocalTotalRight += 1
                }
                else if dataDict.answerEnglish ?? "" == "second_option_english" && indexPath.row == 1
                {
                    self.saveLocalPoints += self.quizSecWaitTimer.value ?? 0
                    self.rightWrongIndex = indexPath.row
                    self.questionsData = ["question_id":dataDict.id ?? "",
                                          "answer_key":dataDict.answerEnglish ?? "",
                                          "user_answer_key":"second_option_english",
                                          "duration":"\(self.quizSecWaitTimer.value ?? 0)","result":"right"]
                    self.saveLocalTotalRight += 1
                }
                else if dataDict.answerEnglish ?? "" == "third_option_english" && indexPath.row == 2
                {
                    self.saveLocalPoints += self.quizSecWaitTimer.value ?? 0
                    self.rightWrongIndex = indexPath.row
                    self.questionsData = ["question_id":dataDict.id ?? "",
                                          "answer_key":dataDict.answerEnglish ?? "",
                                          "user_answer_key":"third_option_english",
                                          "duration":"\(self.quizSecWaitTimer.value ?? 0)","result":"right"]
                    self.saveLocalTotalRight += 1
                }
                else if dataDict.answerEnglish ?? "" == "fourth_option_english" && indexPath.row == 3
                {
                    self.saveLocalPoints += self.quizSecWaitTimer.value ?? 0
                    self.rightWrongIndex = indexPath.row
                    self.questionsData = ["question_id":dataDict.id ?? "",
                                          "answer_key":dataDict.answerEnglish ?? "",
                                          "user_answer_key":"fourth_option_english",
                                          "duration":"\(self.quizSecWaitTimer.value ?? 0)","result":"right"]
                    self.saveLocalTotalRight += 1
                }
                else
                {
                    var tempAnswrKey = ""
                    if indexPath.row == 0
                    {
                        tempAnswrKey = "first_option_english"
                    }
                    else if indexPath.row == 1
                    {
                        tempAnswrKey = "second_option_english"
                    }
                    else if indexPath.row == 2
                    {
                        tempAnswrKey = "third_option_english"
                    }
                    else if indexPath.row == 3
                    {
                        tempAnswrKey = "fourth_option_english"
                    }
                    self.saveLocalTotalWrong += 1
                    self.questionsData = ["question_id":dataDict.id ?? "",
                                          "answer_key":dataDict.answerEnglish ?? "",
                                          "user_answer_key":tempAnswrKey,
                                          "duration":"0","result":"wrong"]
                }
             case "hindi":
                if dataDict.answerHindi ?? "" == "first_option_hindi" && indexPath.row == 0
                {
                    self.saveLocalPoints += self.quizSecWaitTimer.value ?? 0
                    self.rightWrongIndex = indexPath.row
                    self.questionsData = ["question_id":dataDict.id ?? "",
                                          "answer_key":dataDict.answerHindi ?? "",
                                          "user_answer_key":"first_option_hindi",
                                          "duration":"\(self.quizSecWaitTimer.value ?? 0)","result":"right"]
                    self.saveLocalTotalRight += 1
                }
                else if dataDict.answerHindi ?? "" == "second_option_hindi" && indexPath.row == 1
                {
                    self.saveLocalPoints += self.quizSecWaitTimer.value ?? 0
                    self.rightWrongIndex = indexPath.row
                    self.questionsData = ["question_id":dataDict.id ?? "",
                                          "answer_key":dataDict.answerHindi ?? "",
                                          "user_answer_key":"second_option_hindi",
                                          "duration":"\(self.quizSecWaitTimer.value ?? 0)","result":"right"]
                    self.saveLocalTotalRight += 1
                }
                else if dataDict.answerHindi ?? "" == "third_option_hindi" && indexPath.row == 2
                {
                    self.saveLocalPoints += self.quizSecWaitTimer.value ?? 0
                    self.rightWrongIndex = indexPath.row
                    self.questionsData = ["question_id":dataDict.id ?? "",
                                          "answer_key":dataDict.answerHindi ?? "",
                                          "user_answer_key":"third_option_hindi",
                                          "duration":"\(self.quizSecWaitTimer.value ?? 0)","result":"right"]
                    self.saveLocalTotalRight += 1
                }
                else if dataDict.answerHindi ?? "" == "fourth_option_hindi" && indexPath.row == 4
                {
                    self.saveLocalPoints += self.quizSecWaitTimer.value ?? 0
                    self.rightWrongIndex = indexPath.row
                    self.questionsData = ["question_id":dataDict.id ?? "",
                                          "answer_key":dataDict.answerHindi ?? "",
                                          "user_answer_key":"fourth_option_hindi",
                                          "duration":"\(self.quizSecWaitTimer.value ?? 0)","result":"right"]
                    self.saveLocalTotalRight += 1
                }
                else
                {
                    var tempAnswrKey = ""
                    if indexPath.row == 0
                    {
                        tempAnswrKey = "first_option_hindi"
                    }
                    else if indexPath.row == 1
                    {
                        tempAnswrKey = "second_option_hindi"
                    }
                    else if indexPath.row == 2
                    {
                        tempAnswrKey = "third_option_hindi"
                    }
                    else if indexPath.row == 3
                    {
                        tempAnswrKey = "fourth_option_hindi"
                    }
                    self.saveLocalTotalWrong += 1
                    self.questionsData = ["question_id":dataDict.id ?? "",
                                          "answer_key":dataDict.answerHindi ?? "",
                                          "user_answer_key":tempAnswrKey,
                                          "duration":"0","result":"wrong"]
                }
             default:
                if dataDict.answerEnglish ?? "" == "first_option_english" && indexPath.row == 0
                {
                    self.saveLocalPoints += self.quizSecWaitTimer.value ?? 0
                    self.rightWrongIndex = indexPath.row
                    self.questionsData = ["question_id":dataDict.id ?? "",
                                          "answer_key":dataDict.answerEnglish ?? "",
                                          "user_answer_key":"first_option_english",
                                          "duration":"\(self.quizSecWaitTimer.value ?? 0)","result":"right"]
                    self.saveLocalTotalRight += 1
                }
                else if dataDict.answerEnglish ?? "" == "second_option_english" && indexPath.row == 1
                {
                    self.saveLocalPoints += self.quizSecWaitTimer.value ?? 0
                    self.rightWrongIndex = indexPath.row
                    self.questionsData = ["question_id":dataDict.id ?? "",
                                          "answer_key":dataDict.answerEnglish ?? "",
                                          "user_answer_key":"second_option_english",
                                          "duration":"\(self.quizSecWaitTimer.value ?? 0)","result":"right"]
                    self.saveLocalTotalRight += 1
                }
                else if dataDict.answerEnglish ?? "" == "third_option_english" && indexPath.row == 2
                {
                    self.saveLocalPoints += self.quizSecWaitTimer.value ?? 0
                    self.rightWrongIndex = indexPath.row
                    self.questionsData = ["question_id":dataDict.id ?? "",
                                          "answer_key":dataDict.answerEnglish ?? "",
                                          "user_answer_key":"third_option_english",
                                          "duration":"\(self.quizSecWaitTimer.value ?? 0)","result":"right"]
                    self.saveLocalTotalRight += 1
                }
                else if dataDict.answerEnglish ?? "" == "fourth_option_english" && indexPath.row == 3
                {
                    self.saveLocalPoints += self.quizSecWaitTimer.value ?? 0
                    self.rightWrongIndex = indexPath.row
                    self.questionsData = ["question_id":dataDict.id ?? "",
                                          "answer_key":dataDict.answerEnglish ?? "",
                                          "user_answer_key":"fourth_option_english",
                                          "duration":"\(self.quizSecWaitTimer.value ?? 0)","result":"right"]
                    self.saveLocalTotalRight += 1
                }
                else
                {
                    var tempAnswrKey = ""
                    if indexPath.row == 0
                    {
                        tempAnswrKey = "first_option_english"
                    }
                    else if indexPath.row == 1
                    {
                        tempAnswrKey = "second_option_english"
                    }
                    else if indexPath.row == 2
                    {
                        tempAnswrKey = "third_option_english"
                    }
                    else if indexPath.row == 3
                    {
                        tempAnswrKey = "fourth_option_english"
                    }
                    self.saveLocalTotalWrong += 1
                    self.questionsData = ["question_id":dataDict.id ?? "",
                                          "answer_key":dataDict.answerEnglish ?? "",
                                          "user_answer_key":tempAnswrKey,
                                          "duration":"0","result":"wrong"]
                }
            }
            
            self.lblUser1Points.text = "\(self.saveLocalPoints) Pts"
            
            
            self.selectedIndex = indexPath.row
            self.tblView.isUserInteractionEnabled = false
            
            self.tblView.reloadData()
            
        }
    }
    
    func LoadOtherQuestion()
    {
        
        if self.questionsData.count == 0
        {
            let dataDict = self.questions[self.currentCount]
            
            self.saveLocalTotalWrong += 1
            if dataDict.questionLanguage ?? "" == "hindi"
            {
                self.questionsData = ["question_id":dataDict.id ?? "",
                                      "answer_key":dataDict.answerHindi ?? "",
                                      "user_answer_key":"",
                                      "duration":"0",
                                      "result":"missed"]
            }
            else
            {
                self.questionsData = ["question_id":dataDict.id ?? "",
                                      "answer_key":dataDict.answerEnglish ?? "",
                                      "user_answer_key":"",
                                      "duration":"0",
                                      "result":"missed"]
            }
            
            self.appDelegate.socket.emit("RunningContest", ["Points":"\(self.saveLocalPoints)","matchId":self.myContestDoc?.id ?? "","user_id":defaults[.UserSaltId],"questionData":self.questionsData,"TotalRightAnswer":"\(self.saveLocalTotalRight)","TotalWrongAnswer":"\(self.saveLocalTotalWrong)"])
        }
        else
        {
            self.appDelegate.socket.emit("RunningContest", ["Points":"\(self.saveLocalPoints)","matchId":self.myContestDoc?.id ?? "","user_id":defaults[.UserSaltId],"questionData":self.questionsData,"TotalRightAnswer":"\(self.saveLocalTotalRight)","TotalWrongAnswer":"\(self.saveLocalTotalWrong)"])
        }
        
        self.currentCount += 1
        self.tblView.isUserInteractionEnabled = true
        
        print("CurrentCount-->\(self.currentCount) and QuestionCount---> \(self.questions.count)")
        
        if self.currentCount == self.questions.count
        {
            self.ShowQuizWaitView.isHidden = false
            self.lblFindUser.text = "Please Wait Loading Results"
            self.lblTimerSec.text = ""
            self.sectionCount = 0
            self.section1RowCount = 0
            self.section2RowCount = 0
            self.quizSecWaitTimer.stop()
            self.fiveSecWaitTimer.start()
            self.appDelegate.socket.emit("endContestGame",["match_id":"\(self.myContestDoc?.id ?? "")","user_id":"\(defaults[.UserSaltId])"])
        }
        else
        {
            self.defaultQuestionType = self.questions[self.currentCount].questionType ?? ""
            self.lblQuestions.text = "Q. \(self.currentCount + 1)/\(self.questions.count)"
            self.progressBar.progress = 1.0
            self.lblTimerSec.text = ""
            self.ShowQuizWaitView.isHidden = false
            self.lblFindUser.text = "Loading Questions"
            self.sectionCount = 0
            self.section1RowCount = 0
            self.section2RowCount = 0
            self.quizSecWaitTimer.stop()
            self.fiveSecWaitTimer.start()
            
        }
        
    }
}

extension ContestQuizPlayVC
{
    
    func CallMatchCompleted()
    {
        
        matchStarted = false
        userMatchID = ""
        self.tenSecWaitTimer.stop()
        self.fiveSecWaitTimer.stop()
        self.quizSecWaitTimer.stop()
        
        //self.appDelegate.socket.disconnect()
        //self.appDelegate.disconnect()
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            // code to remove your view
            let vc = AppStoryboard.SingleQuiz.instance.instantiateViewController(withIdentifier: "WinnerViewController") as! WinnerViewController
            
            let tempDict = MatchCompletedResult(rightAnswers: self.saveLocalTotalRight, wrongAnswers: self.saveLocalTotalWrong, totalPoints: self.saveLocalPoints, winnerID: "", winnerPoints: 0, winAmount: 0, losserID: "", losserPoints: 0, totalQuestion: self.questions.count)
            vc.matchData = tempDict
            vc.strFrom = "LiveContest"
            vc.modalPresentationStyle = .fullScreen
            self.present(vc, animated: true, completion: nil)
        }
        
        
    }
}



