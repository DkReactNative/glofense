//
//  QuizInviteJoinVC.swift
//  QuizFantasy
//
//  Created by octal on 06/08/20.
//  Copyright © 2020 octal. All rights reserved.
//

import UIKit

class QuizInviteJoinVC: UIViewController {

    @IBOutlet weak var txtCode: UITextField!

    @IBOutlet weak var statusBarHeight: NSLayoutConstraint!

    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        
        self.statusBarHeight.constant = self.getStatusBarHeight()

    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        self.navigationController?.navigationBar.isHidden = true
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
        self.navigationController?.popViewController(animated: true)
    }

    
    @IBAction func submitBtnPressed(_ sender: Any)
    {
        if self.txtCode.text?.count ?? 0 == 0
        {
            self.showMessageFromTop(message: "Please enter invite code")
            return
        }
        else
        {
            self.CallCheckCode()
        }
    }
}


//MARK: - Api Calling
extension QuizInviteJoinVC
{
    func CallCheckCode()
    {
        let ApiFuture = APIClient.verifyInviteUserCodeWebService(invite_code: self.txtCode.text ?? "")
        
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
                        let vc = AppStoryboard.Home.instance.instantiateViewController(withIdentifier: "SingleQuizContestDetailVC") as! SingleQuizContestDetailVC

                        vc.categoryID = dataDict.quizID?.categoryID?.id ?? ""
                        vc.categoryMedia = dataDict.quizID?.categoryID?.image ?? ""
                        vc.quizID = dataDict.quizID?.id ?? ""
                        vc.strFrom = "InviteCode"
                        vc.strInviteCode = dataDict.inviteCode ?? ""
                        self.navigationController?.interactivePopGestureRecognizer?.isEnabled = false
                        self.navigationController?.pushViewController(vc, animated: true)
                    }
                    
                }
                else
                {
                    self.showMessageFromTop(message: "\(ApiData.msg?.value ?? "")")
                }
                
            }
            
        }, onFailure: { error in
            print(error.localizedDescription)
            
        })
    }
}
