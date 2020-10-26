//
//  InviteQuizViewController.swift
//  QuizFantasy
//
//  Created by octal on 06/08/20.
//  Copyright © 2020 octal. All rights reserved.
//

import UIKit

class InviteQuizViewController: UIViewController {

    @IBOutlet weak var lblShareCode: UILabel!
    @IBOutlet weak var lblNotes: UILabel!

    @IBOutlet weak var statusBarHeight: NSLayoutConstraint!

    var strShareCode = ""
    
    var isPresented = false
    
    var quizDetails:QuizContestDetailResults?
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        self.statusBarHeight.constant = self.getStatusBarHeight()

        self.appDelegate.socket = self.appDelegate.manager.defaultSocket
        
        self.lblShareCode.text = self.strShareCode
        
        self.appDelegate.socket.connect()
        
        addHandlers()
        
        

        
        
        let rankString = NSMutableAttributedString(string: "Most Important Note Please Read carefully.")
        
        rankString.setColorForText("Most Important Note Please Read carefully.", with: .black)
        rankString.setFontForText("Most Important Note Please Read carefully.", with: UIFont(name: "Poppins-Medium", size: 15.0)!)
        
        let amountString = NSMutableAttributedString(string: """
\n
1. Once you shared the code do not leave this screen. If you leave this screen or close the application your shared code will be invalid.

2. Your amount will be automatically deducted once shared user join the quiz.

3. You will be automatically redirect to quiz section once other user join this quiz.
""")

        amountString.setColorForText("""
        \n
        1. Once you shared the code do not leave this screen. If you leave this screen or close the application your shared code will be invalid.

        2. Your amount will be automatically deducted once shared user join the quiz.

        3. You will be automatically redirect to quiz section once other user join this quiz.
        """, with: .darkGray)
        amountString.setFontForText("""
        \n
        1. Once you shared the code do not leave this screen. If you leave this screen or close the application your shared code will be invalid.

        2. Your amount will be automatically deducted once shared user join the quiz.

        3. You will be automatically redirect to quiz section once other user join this quiz.
        """, with: UIFont(name: "Poppins-Medium", size: 15.0)!)
        
        rankString.append(amountString)
        
        self.lblNotes.attributedText = rankString
        
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        self.navigationController?.navigationBar.isHidden = true
    }

    func addHandlers()
    {
        self.appDelegate.socket.on("startInviteGame_\(defaults[.UserSaltId])") {[weak self] data, ack in
            print("data--->",data)
            if data.count > 0
            {
                let tempDict = data[0] as? [String:Any]
                
                let vc = AppStoryboard.SingleQuiz.instance.instantiateViewController(withIdentifier: "SingleQuizPlayVC") as! SingleQuizPlayVC
                vc.quizDetails = self?.quizDetails
                vc.strFromInvite = "FromInvite"
                vc.strMatchID = tempDict!["match_id"] as? String ?? ""
                
                vc.modalPresentationStyle = .fullScreen
                self?.present(vc, animated: true, completion: nil)
            }
            return
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

    @IBAction func backBtnPressed(_ sender: Any)
    {
        appDelegate.socket.emit("removeInviteCode",["user_id":"\(defaults[.UserSaltId])","invite_code":"\(self.strShareCode)","quiz_id":"\(self.quizDetails?.id ?? "")"])
        self.navigationController?.popViewController(animated: true)
    }

    
    @IBAction func shareBtnPressed(_ sender: Any)
    {
        let text = "You think, you can beat me join the quiz game with my invite code \(self.strShareCode) and let's play.\n Download App Now \nAndroid\n"
        
        let textToShare = [ text ]
        let activityViewController = UIActivityViewController(activityItems: textToShare, applicationActivities: nil)
        activityViewController.popoverPresentationController?.sourceView = self.view
        activityViewController.excludedActivityTypes = [ UIActivity.ActivityType.airDrop, UIActivity.ActivityType.postToFacebook ]
        self.present(activityViewController, animated: true, completion: nil)
    }
    
}
