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

class SingleQuizPlayVC: UIViewController , VersaPlayerPlaybackDelegate
{
    @IBOutlet weak var tblView: UITableView!
    @IBOutlet weak var statusBarHeight: NSLayoutConstraint!

    @IBOutlet weak var progressBar: UIProgressView!
    
    @IBOutlet weak var lblTimerSec: UILabel!

    @IBOutlet weak var lblUser1Name: UILabel!
    @IBOutlet weak var User1Img: UIImageView!
    @IBOutlet weak var lblUser1Points: UILabel!
    @IBOutlet weak var User1PointView: UIView!

    @IBOutlet weak var lblUser2Name: UILabel!
    @IBOutlet weak var User2Img: UIImageView!
    @IBOutlet weak var lblUser2Points: UILabel!
    @IBOutlet weak var User2PointView: UIView!
    
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
    @IBOutlet weak var videoControls: VersaPlayerControls!

    //*****//
    
    //*****//AudioQuiz
    @IBOutlet weak var lblAudioQuizQues: UILabel!
    @IBOutlet weak var audioPlayer : VersaPlayerView!
    @IBOutlet weak var AudioQuizView: UIView!
    @IBOutlet weak var audioControls: VersaPlayerControls!
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
    
    var quizDetails:QuizContestDetailResults?
    
    var otherUserName = ""
    var otherUserImageUrl = ""
    var otherUserID = ""

    var currentCount = 0
    
    var saveLocalPoints = 0
    
    var rightWrongIndex = -1
    var selectedIndex = -1

    
    var saveLocalTotalRight = 0
    var saveLocalTotalWrong = 0
    
    var questionsData = [String:Any]()
    
    var defaultQuestionType = ""
    
    var strFromInvite = ""
    var strMatchID = ""
    
    var quizLanguage =  ""
    
    private lazy var tenSecWaitTimer: AsyncTimer = {
        return AsyncTimer(
            interval: .milliseconds(1000),
            times: 30,
            block: { [weak self] value in
                self?.ShowQuizWaitView.isHidden = false
                self?.quizWaitTimer.text = value.description
                
                if value == 29
                {
                    if self?.strFromInvite == "FromInvite"
                    {
                        self?.CallQuestionsApi()
                    }
                    else
                    {
                        self?.CallUserQuizDetail()
                    }
                    
                }
                
            }, completion: { [weak self] in
                
                if self?.isOtherUserFound == true
                {
                    if self?.isQuestionsFound == false
                    {
                        if self?.strFromInvite == "FromInvite"
                        {
                            self?.CallQuestionsApi()
                        }
                        else
                        {
                            self?.CallUserQuizDetail()
                        }
                        
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
                        if self?.currentCount ?? 0 < self?.questionData?.questions?.count ?? 0
                        {
                            self?.ShowQuizWaitView.isHidden = true
                            
                            if self?.defaultQuestionType == "audio"
                            {
                                self?.AudioQuizView.isHidden = false
                                self?.VideoQuizView.isHidden = true
                                self?.TextQuizView.isHidden = true
                                self?.ImageQuizView.isHidden = true
                                
                                switch self?.questionData?.questions?[self?.currentCount ?? 0].questionLanguage ?? "" {
                                case "hindi_english":
                                    self?.lblAudioQuizQues.text = self?.questionData?.questions?[self?.currentCount ?? 0].questionEnglish ?? ""
                                case "hindi":
                                    self?.lblAudioQuizQues.text = self?.questionData?.questions?[self?.currentCount ?? 0].questionHindi ?? ""
                                default:
                                    self?.lblAudioQuizQues.text = self?.questionData?.questions?[self?.currentCount ?? 0].questionEnglish ?? ""
                                }
                                
                                if let url = URL.init(string: "\(self?.questionData?.questions?[self?.currentCount ?? 0].questionFile ?? "")")
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
                                
                                switch self?.questionData?.questions?[self?.currentCount ?? 0].questionLanguage ?? "" {
                                case "hindi_english":
                                    self?.lblVideoQuizQues.text = self?.questionData?.questions?[self?.currentCount ?? 0].questionEnglish ?? ""
                                case "hindi":
                                    self?.lblVideoQuizQues.text = self?.questionData?.questions?[self?.currentCount ?? 0].questionHindi ?? ""
                                default:
                                    self?.lblVideoQuizQues.text = self?.questionData?.questions?[self?.currentCount ?? 0].questionEnglish ?? ""
                                }
                                
                                if let url = URL.init(string: "\(self?.questionData?.questions?[self?.currentCount ?? 0].questionFile ?? "")") {
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
//
                                switch self?.questionData?.questions?[self?.currentCount ?? 0].questionLanguage ?? "" {
                                case "hindi_english":
                                    self?.lblImageQuizQues.text = self?.questionData?.questions?[self?.currentCount ?? 0].questionEnglish ?? ""
                                case "hindi":
                                    self?.lblImageQuizQues.text = self?.questionData?.questions?[self?.currentCount ?? 0].questionHindi ?? ""
                                default:
                                    self?.lblImageQuizQues.text = self?.questionData?.questions?[self?.currentCount ?? 0].questionEnglish ?? ""
                                }
                                
                                if let url = URL.init(string: "\(self?.questionData?.questions?[self?.currentCount ?? 0].questionFile ?? "")") {
                                    print("ImageFile-->",url)
                                    
                                    
                                    let processor = DownsamplingImageProcessor(size: (self?.ImageQuizImg.bounds.size)!)
                                        |> RoundCornerImageProcessor(cornerRadius: 0)
                                    self?.ImageQuizImg.kf.indicatorType = .activity
                                    self?.ImageQuizImg.kf.setImage(
                                        with: url,
                                        placeholder: UIImage(named: "placeholderImage"),
                                        options: [
                                            .processor(processor),
                                            .scaleFactor(UIScreen.main.scale),
                                            .transition(.fade(1)),
                                            .cacheOriginalImage
                                        ])
                                    {
                                        result in
                                        switch result {
                                        case .success(let value):
                                            print("Task done for: \(value.source.url?.absoluteString ?? "")")
                                            self?.ImageQuizImg.image = value.image
                                        case .failure(let error):
                                            print("Job failed: \(error.localizedDescription)")
                                        }
                                    }
                                }
                                
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
                                
                                switch self?.questionData?.questions?[self?.currentCount ?? 0].questionLanguage ?? "" {
                                case "hindi_english":
                                    self?.lblTextQuizQues.text = self?.questionData?.questions?[self?.currentCount ?? 0].questionEnglish ?? ""
                                case "hindi":
                                    self?.lblTextQuizQues.text = self?.questionData?.questions?[self?.currentCount ?? 0].questionHindi ?? ""
                                default:
                                    self?.lblTextQuizQues.text = self?.questionData?.questions?[self?.currentCount ?? 0].questionEnglish ?? ""
                                }
                                
                                
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
                    if self?.currentCount ?? 0 < self?.questionData?.questions?.count ?? 0
                    {
                        if self?.defaultQuestionType == "audio"
                        {
                            self?.sectionCount = 0
                            self?.section1RowCount = 0
                            self?.section2RowCount = 0
                            self?.tblView.reloadData()
                            
                            if self?.audioPlayer.isPlaying ?? false == false
                            {
                                if let url = URL.init(string: "\(self?.questionData?.questions?[self?.currentCount ?? 0].questionFile ?? "")")
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
                                if let url = URL.init(string: "\(self?.questionData?.questions?[self?.currentCount ?? 0].questionFile ?? "")")
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
                            
                            if let url = URL.init(string: "\(self?.questionData?.questions?[self?.currentCount ?? 0].questionFile ?? "")")
                            {
                                print("ImageFile-->",url)
                                
                                let processor = DownsamplingImageProcessor(size: (self?.ImageQuizImg.bounds.size)!)
                                    |> RoundCornerImageProcessor(cornerRadius: 0)
                                self?.ImageQuizImg.kf.indicatorType = .activity
                                self?.ImageQuizImg.kf.setImage(
                                    with: url,
                                    placeholder: UIImage(named: "placeholderImage"),
                                    options: [
                                        .processor(processor),
                                        .scaleFactor(UIScreen.main.scale),
                                        .transition(.fade(1)),
                                        .cacheOriginalImage
                                    ])
                                {
                                    result in
                                    switch result {
                                    case .success(let value):
                                        print("Task done for: \(value.source.url?.absoluteString ?? "")")
                                        self?.ImageQuizImg.image = value.image
                                    case .failure(let error):
                                        print("Job failed: \(error.localizedDescription)")
                                    }
                                }
                                
//                                let resource = ImageResource(downloadURL: url)
//
//                                KingfisherManager.shared.retrieveImage(with: resource, options: nil, progressBlock: nil) { result in
//                                    switch result {
//                                    case .success(let value):
//                                        print("Image: \(value.image). Got from: \(value.cacheType)")
//                                        self?.ImageQuizImg.image = value.image
//                                    case .failure(let error):
//                                        print("Error: \(error)")
//                                    }
//                                }
                            }
                            
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

                if self!.currentCount != self?.questionData?.questions?.count ?? 0
                {
                    self?.LoadOtherQuestion()
                }
                
            }
        )
    }()
    
    var gameType = "Online"
    
    var isOtherUserFound = false
    var isQuestionsFound = false

    var questionData:OnlineSearchResults?
    
    override func viewDidLoad()
    {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        
        self.statusBarHeight.constant = self.getStatusBarHeight()
        
        self.lblFindUser.text = "Waiting for opponent to join"
        
        self.appDelegate.socket = self.appDelegate.manager.defaultSocket
        
        
        self.appDelegate.socket.connect()
        
        addHandlers()
        
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

        self.videoPlayer.contentMode = .scaleToFill
        
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
    
    func SetupOtherUI()
    {
        if let url = URL(string:self.otherUserImageUrl) {
            self.User2Img.kf.setImage(with: url, placeholder: UIImage(named: "avatar"))
        }else {
            self.User2Img.image = UIImage.init(named: "avatar")
        }
        
        self.lblUser2Name.text = self.otherUserName
    }
    
    func addHandlers()
    {
        self.appDelegate.socket.on("startGame_\(defaults[.UserSaltId])") {[weak self] data, ack in
            print("data--->",data)
            if data.count > 0
            {
                let tempDict = data[0] as? [String:Any]
                tempDict?.toJson()
                
                let finalDict = tempDict?["mess"] as? [String:Any]
                
                if finalDict?.count ?? 0 > 0
                {
                    self?.otherUserName = finalDict?["username"] as? String ?? ""
                    self?.otherUserImageUrl = finalDict?["image"] as? String ?? ""

                    
                    self?.SetupOtherUI()
                    self?.tenSecWaitTimer.stop()
                    self?.ShowQuizWaitView.isHidden = false
                    self?.lblFindUser.text = "Loading Questions"
                    self?.fiveSecWaitTimer.start()
                }
                
                self?.isOtherUserFound = true
            }
            return
        }
    }
    
    func addMatchHandlers()
    {
        let tempID = "RunningGame_\(self.otherUserID)"
        
        self.appDelegate.socket.on(tempID) {[weak self] data, ack in
            print("RunningGame_data--->",data)
            if data.count > 0
            {
                let tempDict = data[0] as? [String:Any]
                tempDict?.toJson()
                self?.lblUser2Points.text = "\(tempDict?["Points"] as? String ?? "0") Pts"
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
            if self.strFromInvite == "FromInvite"
            {
                self.appDelegate.socket.emit("removeInviteCode",["user_id":"\(defaults[.UserSaltId])","invite_code":"\(userInviteCode)","quiz_id":"\(inviteMatchID)"])
            }
            else
            {
                self.appDelegate.socket.emit("endGame",["match_id":"\(self.questionData?.matchID ?? "")","user_id":"\(defaults[.UserSaltId])"])
            }
            
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1)
            {
                self.view.window!.rootViewController?.dismiss(animated: false, completion: {
                    self.appDelegate.SetMainRootVC()
                })
            }
            break
        case .background:
            //app is in background, if content-available key of your notification is set to 1, poll to your backend to retrieve data and update your interface here
            self.tenSecWaitTimer.stop()
            self.fiveSecWaitTimer.stop()
            self.quizSecWaitTimer.stop()
            if self.strFromInvite == "FromInvite"
            {
                self.appDelegate.socket.emit("removeInviteCode",["user_id":"\(defaults[.UserSaltId])","invite_code":"\(userInviteCode)","quiz_id":"\(inviteMatchID)"])
            }
            else
            {
                self.appDelegate.socket.emit("endGame",["match_id":"\(self.questionData?.matchID ?? "")","user_id":"\(defaults[.UserSaltId])"])
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1)
            {
                self.view.window!.rootViewController?.dismiss(animated: false, completion: {
                    self.appDelegate.SetMainRootVC()
                })
            }
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
            if self.strFromInvite == "FromInvite"
            {
                self.appDelegate.socket.emit("removeInviteCode",["user_id":"\(defaults[.UserSaltId])","invite_code":"\(userInviteCode)","quiz_id":"\(inviteMatchID)"])
            }
            else
            {
                self.appDelegate.socket.emit("endGame",["match_id":"\(self.questionData?.matchID ?? "")","user_id":"\(defaults[.UserSaltId])"])
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1)
            {
                self.view.window!.rootViewController?.dismiss(animated: false, completion: {
                    self.appDelegate.SetMainRootVC()
                })
            }
            break
        case .background:
            //app is in background, if content-available key of your notification is set to 1, poll to your backend to retrieve data and update your interface here
            self.tenSecWaitTimer.stop()
            self.fiveSecWaitTimer.stop()
            self.quizSecWaitTimer.stop()
            if self.strFromInvite == "FromInvite"
            {
                self.appDelegate.socket.emit("removeInviteCode",["user_id":"\(defaults[.UserSaltId])","invite_code":"\(userInviteCode)","quiz_id":"\(inviteMatchID)"])
            }
            else
            {
                self.appDelegate.socket.emit("endGame",["match_id":"\(self.questionData?.matchID ?? "")","user_id":"\(defaults[.UserSaltId])"])
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1)
            {
                self.view.window!.rootViewController?.dismiss(animated: false, completion: {
                    self.appDelegate.SetMainRootVC()
                })
            }
            
            break
        default:
            break
        }
        
    }
    
    // MARK: - Notification Received
    
    @objc func CallAppLocked(_ notification: NSNotification)
    {
        if self.strFromInvite == "FromInvite"
        {
            self.appDelegate.socket.emit("removeInviteCode",["user_id":"\(defaults[.UserSaltId])","invite_code":"\(userInviteCode)","quiz_id":"\(inviteMatchID)"])
        }
        else
        {
            self.appDelegate.socket.emit("endGame",["match_id":"\(self.questionData?.matchID ?? "")","user_id":"\(defaults[.UserSaltId])"])
        }
        
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
            if self.questionData?.matchID ?? "" != ""
            {
                self.appDelegate.socket.emit("endGame",["match_id":"\(self.questionData?.matchID ?? "")","user_id":"\(defaults[.UserSaltId])"])
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
extension SingleQuizPlayVC
{
    func setProgress()
    {
       
    }
    
}

//MARK: - TableView
extension SingleQuizPlayVC : UITableViewDelegate, UITableViewDataSource
{
    func numberOfSections(in tableView: UITableView) -> Int
    {
        if self.currentCount < self.questionData?.questions?.count ?? 0
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
        let cellMatch =  tableView.dequeueReusableCell(withIdentifier: "AnswersTblCell", for: indexPath) as! AnswersTblCell
        cellMatch.selectionStyle = .none
        
        let quesData = self.questionData?.questions?[currentCount]
        
        switch quesData?.questionLanguage ?? "" {
        case "hindi_english":
            if indexPath.row == 0
            {
                cellMatch.lblAnswer.text = quesData?.firstOptionEnglish ?? ""
            }
            else if indexPath.row == 1
            {
                cellMatch.lblAnswer.text = quesData?.secondOptionEnglish ?? ""
            }
            else if indexPath.row == 2
            {
                cellMatch.lblAnswer.text = quesData?.thirdOptionEnglish ?? ""
            }
            else if indexPath.row == 3
            {
                cellMatch.lblAnswer.text = quesData?.fourthOptionEnglish ?? ""
            }
            
        case "hindi":
            if indexPath.row == 0
            {
                cellMatch.lblAnswer.text = quesData?.firstOptionHindi ?? ""
            }
            else if indexPath.row == 1
            {
                cellMatch.lblAnswer.text = quesData?.secondOptionHindi ?? ""
            }
            else if indexPath.row == 2
            {
                cellMatch.lblAnswer.text = quesData?.thirdOptionHindi ?? ""
            }
            else if indexPath.row == 3
            {
                cellMatch.lblAnswer.text = quesData?.fourthOptionHindi ?? ""
            }
        default:
            if indexPath.row == 0
            {
                cellMatch.lblAnswer.text = quesData?.firstOptionEnglish ?? ""
            }
            else if indexPath.row == 1
            {
                cellMatch.lblAnswer.text = quesData?.secondOptionEnglish ?? ""
            }
            else if indexPath.row == 2
            {
                cellMatch.lblAnswer.text = quesData?.thirdOptionEnglish ?? ""
            }
            else if indexPath.row == 3
            {
                cellMatch.lblAnswer.text = quesData?.fourthOptionEnglish ?? ""
            }
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
            let dataDict = self.questionData?.questions?[self.currentCount]
            
            self.questionsData = [String:Any]()
            
            switch dataDict?.questionLanguage ?? "" {
             case "hindi_english":
                if dataDict?.answerEnglish ?? "" == "first_option_english" && indexPath.row == 0
                {
                    self.saveLocalPoints += self.quizSecWaitTimer.value ?? 0
                    self.rightWrongIndex = indexPath.row
                    self.questionsData = ["question_id":dataDict?.id ?? "",
                                          "answer_key":dataDict?.answerEnglish ?? "",
                                          "user_answer_key":"first_option_english",
                                          "duration":"\(self.quizSecWaitTimer.value ?? 0)","result":"right"]
                    self.saveLocalTotalRight += 1
                }
                else if dataDict?.answerEnglish ?? "" == "second_option_english" && indexPath.row == 1
                {
                    self.saveLocalPoints += self.quizSecWaitTimer.value ?? 0
                    self.rightWrongIndex = indexPath.row
                    self.questionsData = ["question_id":dataDict?.id ?? "",
                                          "answer_key":dataDict?.answerEnglish ?? "",
                                          "user_answer_key":"second_option_english",
                                          "duration":"\(self.quizSecWaitTimer.value ?? 0)","result":"right"]
                    self.saveLocalTotalRight += 1
                }
                else if dataDict?.answerEnglish ?? "" == "third_option_english" && indexPath.row == 2
                {
                    self.saveLocalPoints += self.quizSecWaitTimer.value ?? 0
                    self.rightWrongIndex = indexPath.row
                    self.questionsData = ["question_id":dataDict?.id ?? "",
                                          "answer_key":dataDict?.answerEnglish ?? "",
                                          "user_answer_key":"third_option_english",
                                          "duration":"\(self.quizSecWaitTimer.value ?? 0)","result":"right"]
                    self.saveLocalTotalRight += 1
                }
                else if dataDict?.answerEnglish ?? "" == "fourth_option_english" && indexPath.row == 3
                {
                    self.saveLocalPoints += self.quizSecWaitTimer.value ?? 0
                    self.rightWrongIndex = indexPath.row
                    self.questionsData = ["question_id":dataDict?.id ?? "",
                                          "answer_key":dataDict?.answerEnglish ?? "",
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
                    self.questionsData = ["question_id":dataDict?.id ?? "",
                                          "answer_key":dataDict?.answerEnglish ?? "",
                                          "user_answer_key":tempAnswrKey,
                                          "duration":"0","result":"wrong"]
                }
             case "hindi":
                if dataDict?.answerHindi ?? "" == "first_option_hindi" && indexPath.row == 0
                {
                    self.saveLocalPoints += self.quizSecWaitTimer.value ?? 0
                    self.rightWrongIndex = indexPath.row
                    self.questionsData = ["question_id":dataDict?.id ?? "",
                                          "answer_key":dataDict?.answerHindi ?? "",
                                          "user_answer_key":"first_option_hindi",
                                          "duration":"\(self.quizSecWaitTimer.value ?? 0)","result":"right"]
                    self.saveLocalTotalRight += 1
                }
                else if dataDict?.answerHindi ?? "" == "second_option_hindi" && indexPath.row == 1
                {
                    self.saveLocalPoints += self.quizSecWaitTimer.value ?? 0
                    self.rightWrongIndex = indexPath.row
                    self.questionsData = ["question_id":dataDict?.id ?? "",
                                          "answer_key":dataDict?.answerHindi ?? "",
                                          "user_answer_key":"second_option_hindi",
                                          "duration":"\(self.quizSecWaitTimer.value ?? 0)","result":"right"]
                    self.saveLocalTotalRight += 1
                }
                else if dataDict?.answerHindi ?? "" == "third_option_hindi" && indexPath.row == 2
                {
                    self.saveLocalPoints += self.quizSecWaitTimer.value ?? 0
                    self.rightWrongIndex = indexPath.row
                    self.questionsData = ["question_id":dataDict?.id ?? "",
                                          "answer_key":dataDict?.answerHindi ?? "",
                                          "user_answer_key":"third_option_hindi",
                                          "duration":"\(self.quizSecWaitTimer.value ?? 0)","result":"right"]
                    self.saveLocalTotalRight += 1
                }
                else if dataDict?.answerHindi ?? "" == "fourth_option_hindi" && indexPath.row == 4
                {
                    self.saveLocalPoints += self.quizSecWaitTimer.value ?? 0
                    self.rightWrongIndex = indexPath.row
                    self.questionsData = ["question_id":dataDict?.id ?? "",
                                          "answer_key":dataDict?.answerHindi ?? "",
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
                    self.questionsData = ["question_id":dataDict?.id ?? "",
                                          "answer_key":dataDict?.answerHindi ?? "",
                                          "user_answer_key":tempAnswrKey,
                                          "duration":"0","result":"wrong"]
                }
             default:
                if dataDict?.answerEnglish ?? "" == "first_option_english" && indexPath.row == 0
                {
                    self.saveLocalPoints += self.quizSecWaitTimer.value ?? 0
                    self.rightWrongIndex = indexPath.row
                    self.questionsData = ["question_id":dataDict?.id ?? "",
                                          "answer_key":dataDict?.answerEnglish ?? "",
                                          "user_answer_key":"first_option_english",
                                          "duration":"\(self.quizSecWaitTimer.value ?? 0)","result":"right"]
                    self.saveLocalTotalRight += 1
                }
                else if dataDict?.answerEnglish ?? "" == "second_option_english" && indexPath.row == 1
                {
                    self.saveLocalPoints += self.quizSecWaitTimer.value ?? 0
                    self.rightWrongIndex = indexPath.row
                    self.questionsData = ["question_id":dataDict?.id ?? "",
                                          "answer_key":dataDict?.answerEnglish ?? "",
                                          "user_answer_key":"second_option_english",
                                          "duration":"\(self.quizSecWaitTimer.value ?? 0)","result":"right"]
                    self.saveLocalTotalRight += 1
                }
                else if dataDict?.answerEnglish ?? "" == "third_option_english" && indexPath.row == 2
                {
                    self.saveLocalPoints += self.quizSecWaitTimer.value ?? 0
                    self.rightWrongIndex = indexPath.row
                    self.questionsData = ["question_id":dataDict?.id ?? "",
                                          "answer_key":dataDict?.answerEnglish ?? "",
                                          "user_answer_key":"third_option_english",
                                          "duration":"\(self.quizSecWaitTimer.value ?? 0)","result":"right"]
                    self.saveLocalTotalRight += 1
                }
                else if dataDict?.answerEnglish ?? "" == "fourth_option_english" && indexPath.row == 3
                {
                    self.saveLocalPoints += self.quizSecWaitTimer.value ?? 0
                    self.rightWrongIndex = indexPath.row
                    self.questionsData = ["question_id":dataDict?.id ?? "",
                                          "answer_key":dataDict?.answerEnglish ?? "",
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
                    self.questionsData = ["question_id":dataDict?.id ?? "",
                                          "answer_key":dataDict?.answerEnglish ?? "",
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
            let dataDict = self.questionData?.questions?[self.currentCount]
            
            self.saveLocalTotalWrong += 1
            if dataDict?.questionLanguage ?? "" == "hindi"
            {
                self.questionsData = ["question_id":dataDict?.id ?? "",
                                      "answer_key":dataDict?.answerHindi ?? "",
                                      "user_answer_key":"",
                                      "duration":"0",
                                      "result":"missed"]
            }
            else
            {
                self.questionsData = ["question_id":dataDict?.id ?? "",
                                      "answer_key":dataDict?.answerEnglish ?? "",
                                      "user_answer_key":"",
                                      "duration":"0",
                                      "result":"missed"]
            }
            
            self.appDelegate.socket.emit("RunningGame", ["Points":"\(self.saveLocalPoints)","ListnerKey":"RunningGame_\(defaults[.UserSaltId])","matchId":self.questionData?.matchID ?? "","user_id":defaults[.UserSaltId],"questionData":self.questionsData,"TotalRightAnswer":"\(self.saveLocalTotalRight)","TotalWrongAnswer":"\(self.saveLocalTotalWrong)"])
        }
        else
        {
            self.appDelegate.socket.emit("RunningGame", ["Points":"\(self.saveLocalPoints)","ListnerKey":"RunningGame_\(defaults[.UserSaltId])","matchId":self.questionData?.matchID ?? "","user_id":defaults[.UserSaltId],"questionData":self.questionsData,"TotalRightAnswer":"\(self.saveLocalTotalRight)","TotalWrongAnswer":"\(self.saveLocalTotalWrong)"])
        }
        
        self.currentCount += 1
        self.tblView.isUserInteractionEnabled = true
        
        print("CurrentCount-->\(self.currentCount) and QuestionCount---> \(self.questionData?.questions?.count ?? 0)")
        
        self.AudioQuizView.isHidden = true
        self.VideoQuizView.isHidden = true
        self.TextQuizView.isHidden = true
        self.ImageQuizView.isHidden = true
        
        if self.currentCount == self.questionData?.questions?.count ?? 0
        {
            self.ShowQuizWaitView.isHidden = false
            self.lblFindUser.text = "Please Wait Loading Results"
            self.lblTimerSec.text = ""
            self.sectionCount = 0
            self.section1RowCount = 0
            self.section2RowCount = 0
            self.quizSecWaitTimer.stop()
            self.fiveSecWaitTimer.start()
        }
        else
        {
            self.defaultQuestionType = self.questionData?.questions?[self.currentCount].questionType ?? ""
            
            
            
            self.lblQuestions.text = "Q. \(self.currentCount + 1)/\(self.questionData?.questions?.count ?? 0)"
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

extension SingleQuizPlayVC
{
    func CallUserQuizDetail()
    {
        let ApiFuture = APIClient.onlineSearchWebService(quiz_id:self.quizDetails?.id ?? "")
        
        ApiFuture.execute(onSuccess:{ ApiData in
            if ApiData.auth ?? true == false
            {
                self.appDelegate.CallLogoutUser(false)
                return
            }
            else if "\(ApiData.isDeactivate?.value ?? "0")" == "1" || "\(ApiData.isDeactivate?.value ?? 0)" == "1"
            {
                self.showMessageFromTop(message: "Your account has been deactivated. Please contact to admin.")
                self.appDelegate.CallLogoutUser(true)
                return
            }
            else
            {
                if ApiData.success ?? false == true
                {
                    if let dataDict = ApiData.results
                    {
                        matchStarted = true
                        userMatchID = dataDict.matchID ?? ""
                        self.questionData = dataDict
                        self.defaultQuestionType = self.questionData?.questions?[self.currentCount].questionType ?? ""
                        self.lblQuestions.text = "Q. 1/\(self.questionData?.questions?.count ?? 0)"
                        
                        self.isOtherUserFound = true
                        self.isQuestionsFound = true
                        self.otherUserName = dataDict.opponent?.username ??  ""
                        self.otherUserImageUrl = dataDict.opponent?.image ?? ""
                        self.otherUserID = dataDict.opponent?.id ?? ""
                        self.addMatchHandlers()
                        self.SetupOtherUI()
                    }
                    
                }
                
                self.tblView.reloadData()
            }
            
        }, onFailure: { error in
            print(error.localizedDescription)
            
        })
    }
    
    func CallQuestionsApi()
    {
        let ApiFuture = APIClient.inviteUserQuestionWebService(match_id: self.strMatchID)
        
        ApiFuture.execute(onSuccess:{ ApiData in
            if ApiData.auth ?? true == false
            {
                self.appDelegate.CallLogoutUser(false)
                return
            }
            else if "\(ApiData.isDeactivate?.value ?? "0")" == "1" || "\(ApiData.isDeactivate?.value ?? 0)" == "1"
            {
                self.showMessageFromTop(message: "Your account has been deactivated. Please contact to admin.")
                self.appDelegate.CallLogoutUser(true)
                return
            }
            else
            {
                if ApiData.success ?? false == true
                {
                    if let dataDict = ApiData.results
                    {
                        matchStarted = true
                        inviteMatchID = dataDict.matchID ?? ""
                        self.questionData = dataDict
                        self.defaultQuestionType = self.questionData?.questions?[self.currentCount].questionType ?? ""
                        self.lblQuestions.text = "Q. 1/\(self.questionData?.questions?.count ?? 0)"
                        
                        self.isOtherUserFound = true
                        self.isQuestionsFound = true
                        
                        if dataDict.opponent?.id ?? "" != defaults[.UserSaltId]
                        {
                            self.otherUserName = dataDict.opponent?.username ??  ""
                            self.otherUserImageUrl = dataDict.opponent?.image ?? ""
                            self.otherUserID = dataDict.opponent?.id ?? ""
                        }
                        else if dataDict.user?.id ?? "" != defaults[.UserSaltId]
                        {
                            self.otherUserName = dataDict.user?.username ??  ""
                            self.otherUserImageUrl = dataDict.user?.image ?? ""
                            self.otherUserID = dataDict.user?.id ?? ""
                        }
                        
                        self.addMatchHandlers()
                        
                        self.SetupOtherUI()
                        
                        self.tenSecWaitTimer.stop()
                        self.ShowQuizWaitView.isHidden = false
                        self.lblFindUser.text = "Loading Questions"
                        self.fiveSecWaitTimer.start()
                    }
                    
                }
                
                self.tblView.reloadData()
            }
            
        }, onFailure: { error in
            print(error.localizedDescription)
            
        })
    }
    
    
    func CallMatchCompleted()
    {
        let ApiFuture = APIClient.matchCompletedWebService(match_id: self.questionData?.matchID ?? "")
        
        ApiFuture.execute(onSuccess:{ ApiData in
            if ApiData.auth ?? true == false
            {
                self.appDelegate.CallLogoutUser(false)
                return
            }
            else if "\(ApiData.isDeactivate?.value ?? "0")" == "1" || "\(ApiData.isDeactivate?.value ?? 0)" == "1"
            {
                self.showMessageFromTop(message: "Your account has been deactivated. Please contact to admin.")
                self.appDelegate.CallLogoutUser(true)
                return
            }
            else
            {
                if ApiData.success ?? false == true
                {
                    if let dataDict = ApiData.result
                    {
                        matchStarted = false
                        userMatchID = ""
                        inviteMatchID = ""

                        self.tenSecWaitTimer.stop()
                        self.fiveSecWaitTimer.stop()
                        self.quizSecWaitTimer.stop()
                        //self.appDelegate.socket.disconnect()
                        
                        let vc = AppStoryboard.SingleQuiz.instance.instantiateViewController(withIdentifier: "WinnerViewController") as! WinnerViewController
                        vc.matchData = dataDict
                        vc.modalPresentationStyle = .fullScreen
                        self.present(vc, animated: true, completion: nil)
                    }
                    
                }

            }
            
        }, onFailure: { error in
            print(error.localizedDescription)
            
        })
    }
}


class PlayerView: UIView {
    override static var layerClass: AnyClass {
        return AVPlayerLayer.self;
    }

    var playerLayer: AVPlayerLayer {
        return layer as! AVPlayerLayer;
    }
    
    var player: AVPlayer? {
        get {
            return playerLayer.player;
        }
        set {
            playerLayer.player = newValue;
        }
    }
}
