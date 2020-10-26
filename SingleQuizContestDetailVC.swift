//
//  SingleQuizContestDetailVC.swift
//  QuizFantasy
//
//  Created by octal on 13/07/20.
//  Copyright © 2020 octal. All rights reserved.
//

import UIKit

class SingleQuizContestDetailVC: UIViewController {

    @IBOutlet weak var tblView: UITableView!
    @IBOutlet weak var statusBarHeight: NSLayoutConstraint!

    var categoryData:CategoryDoc?

    //var contestData:QuizContestDoc?

    var dataCount = 0
    
    var quizDetails:QuizContestDetailResults?
    
    var categoryID = ""
    var categoryMedia = ""
    var quizID = ""
    
    var strFrom = ""
    var strInviteCode = ""
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        self.statusBarHeight.constant = self.getStatusBarHeight()
        
        tblView.register(UINib(nibName: "OneToOneFreeContestCell", bundle: nil), forCellReuseIdentifier: "OneToOneFreeContestCell")
        
        tblView.register(UINib(nibName: "OneToOnePaidContestCell", bundle: nil), forCellReuseIdentifier: "OneToOnePaidContestCell")

        tblView.register(UINib(nibName: "JoinButtonTblCell", bundle: nil), forCellReuseIdentifier: "JoinButtonTblCell")

        tblView.register(UINib(nibName: "RulesTblCell", bundle: nil), forCellReuseIdentifier: "RulesTblCell")

        
        self.tblView.tableFooterView = UIView()
        
        self.dataCount = 0
        
        self.CallSingleContestDetail()
        
        if self.strFrom == "InviteCode"
        {
            self.SetupForInviteQuiz()
        }
    }
    
    func SetupForInviteQuiz()
    {
        self.appDelegate.socket = self.appDelegate.manager.defaultSocket

        self.appDelegate.socket.connect()
        
        addHandlers()
    }

    
    func addHandlers()
    {
        self.appDelegate.socket.on("startInviteGame_\(defaults[.UserSaltId])") {[weak self] data, ack in
            print("startInviteGame_--->",data)
            if data.count > 0
            {
                let tempDict = data[0] as? [String:Any]
                tempDict?.toJson()
                
                let vc = AppStoryboard.SingleQuiz.instance.instantiateViewController(withIdentifier: "SingleQuizPlayVC") as! SingleQuizPlayVC
                vc.quizDetails = self?.quizDetails
                vc.strFromInvite = "FromInvite"
                vc.strMatchID = tempDict!["match_id"] as? String ?? ""
                //vc.isOtherUserFound = true
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
    
    //MARK: - IBActions
    
    @IBAction func backBtnClicked(_ sender: Any)
    {
        self.navigationController?.popViewController(animated: true)
    }

    @IBAction func inviteBtnClicked(_ sender: Any)
    {
        
        let genrateCode = self.randomNameString(length: 6)
        print("genrateCode-->",genrateCode)
     
        self.CallSaveInviteCode(code:genrateCode)
        
    }
    
    func randomNameString(length: Int = 7)->String
    {
        enum s {
            static let c = Array("abcdefghjklmnpqrstuvwxyz12345789")
            static let k = UInt32(c.count)
        }
        
        var result = [Character](repeating: "-", count: length)
        
        for i in 0..<length {
            let r = Int(arc4random_uniform(s.k))
            result[i] = s.c[r]
        }
        
        return String(result)
    }
    
    
    
    @IBAction func btnJoinContestTapped(_ sender: UIButton)
    {
        if self.strFrom == "InviteCode"
        {
            self.CallJoinSingleQuiz()
        }
        else
        {
            if self.quizDetails != nil
            {
                let vc = AppStoryboard.SingleQuiz.instance.instantiateViewController(withIdentifier: "ChooseQuizViewController") as! ChooseQuizViewController
                vc.quizDetails = self.quizDetails!
                vc.categoryID = self.categoryID
                vc.categoryData = self.categoryData
                self.navigationController?.interactivePopGestureRecognizer?.isEnabled = false
                self.navigationController?.pushViewController(vc, animated: true)
            }
        }
        
        
    }
}

//MARK: - TableView
extension SingleQuizContestDetailVC : UITableViewDelegate, UITableViewDataSource
{
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int
    {
        return dataCount
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell
    {
        switch indexPath.row {
        case 0:
            let dataDict = self.quizDetails
            
//            if dataDict?.quizType ?? "" == "free"
//            {
//                let cellMatch =  tableView.dequeueReusableCell(withIdentifier: "OneToOneFreeContestCell", for: indexPath) as! OneToOneFreeContestCell
//                cellMatch.selectionStyle = .none
//
//                cellMatch.lblContestName.text = dataDict?.name ?? ""
//                cellMatch.lblContestDesc.text = dataDict?.resultsDescription ?? ""
//                cellMatch.lblTotalQues.text = "\(dataDict?.questionsCount ?? 0)"
//
//                if let url = URL(string:"\(self.categoryMedia)")
//                {
//                    cellMatch.ContestImg.kf.setImage(with: url, placeholder: UIImage(named: "logo"))
//                }
//                else
//                {
//                    cellMatch.ContestImg.image = UIImage.init(named: "logo")
//                }
//
//                return cellMatch
//            }
//            else
//            {
                let cellMatch =  tableView.dequeueReusableCell(withIdentifier: "OneToOnePaidContestCell", for: indexPath) as! OneToOnePaidContestCell
                cellMatch.selectionStyle = .none
                
                cellMatch.lblContestName.text = dataDict?.name ?? ""
                cellMatch.lblContestDesc.text = dataDict?.resultsDescription ?? ""
                cellMatch.lblWinningAmount.text = "₹ \(dataDict?.winningAmount ?? 0)"
                cellMatch.lblTotalQues.text = "\(dataDict?.questionsCount ?? 0)"
                cellMatch.lblEntryFee.text = "₹ \(dataDict?.entryFee ?? 0)"

                if let url = URL(string:"\(self.categoryMedia)")
                {
                    cellMatch.ContestImg.kf.setImage(with: url, placeholder: UIImage(named: "logo"))
                }
                else
                {
                    cellMatch.ContestImg.image = UIImage.init(named: "logo")
                }
                
                return cellMatch
            //}
        case 1:
            let cellMatch =  tableView.dequeueReusableCell(withIdentifier: "JoinButtonTblCell", for: indexPath) as! JoinButtonTblCell
            cellMatch.selectionStyle = .none
            cellMatch.btnJoin.setTitle("Join The Quiz", for: .normal)
            cellMatch.btnJoin.addTarget(self, action: #selector(self.btnJoinContestTapped(_:)), for: .touchUpInside)

            return cellMatch
        case 2:
            let cellMatch =  tableView.dequeueReusableCell(withIdentifier: "RulesTblCell", for: indexPath) as! RulesTblCell
            cellMatch.selectionStyle = .none
            
            
            if self.quizDetails?.quizRules ?? "" == ""
            {
                let rankString = NSMutableAttributedString(string: "Important Note")
                
                rankString.setColorForText("Important Note", with: .black)
                rankString.setFontForText("Important Note", with: UIFont(name: "Poppins-Medium", size: 16.0)!)
                
                let amountString = NSMutableAttributedString(string: "\n\n1.There is NO PAUSE in-between a 1v1 Game.\n\n2.You will LOSE if you leave in-between 1v1 game.\n\n3.You must have a stable internet connection. You will lose if you disconnect!.\n\n4.Your game fee is deducted only when you find a match")

                amountString.setColorForText("\n\n1.There is NO PAUSE in-between a 1v1 Game.\n\n2.You will LOSE if you leave in-between 1v1 game.\n\n3.You must have a stable internet connection. You will lose if you disconnect!.\n\n4.Your game fee is deducted only when you find a match", with: .darkGray)
                amountString.setFontForText("\n\n1.There is NO PAUSE in-between a 1v1 Game.\n\n2.You will LOSE if you leave in-between 1v1 game.\n\n3.You must have a stable internet connection. You will lose if you disconnect!.\n\n4.Your game fee is deducted only when you find a match", with: UIFont(name: "Poppins-Medium", size: 16.0)!)
                
                rankString.append(amountString)
                
                cellMatch.lblValue.attributedText = rankString
            }
            else
            {
                let rankString = NSMutableAttributedString(string: "Important Note")
                
                rankString.setColorForText("Important Note", with: .black)
                rankString.setFontForText("Important Note", with: UIFont(name: "Poppins-Medium", size: 16.0)!)
                
                
                let amountString = NSMutableAttributedString(string: "\n\n1.There is NO PAUSE in-between a 1v1 Game.\n\n2.You will LOSE if you leave in-between 1v1 game.\n\n3.You must have a stable internet connection. You will lose if you disconnect!.\n\n4.Your game fee is deducted only when you find a match")

                amountString.setColorForText("\n\n1.There is NO PAUSE in-between a 1v1 Game.\n\n2.You will LOSE if you leave in-between 1v1 game.\n\n3.You must have a stable internet connection. You will lose if you disconnect!.\n\n4.Your game fee is deducted only when you find a match", with: .darkGray)
                amountString.setFontForText("\n\n1.There is NO PAUSE in-between a 1v1 Game.\n\n2.You will LOSE if you leave in-between 1v1 game.\n\n3.You must have a stable internet connection. You will lose if you disconnect!.\n\n4.Your game fee is deducted only when you find a match", with: UIFont(name: "Poppins-Medium", size: 14.0)!)
                
                rankString.append(amountString)
                
                let rules = NSMutableAttributedString(string: "\n\nRules for Quiz")
                rules.setColorForText("\n\nRules for Quiz", with: .black)
                rules.setFontForText("\n\nRules for Quiz", with: UIFont(name: "Poppins-Medium", size: 16.0)!)
                
                let rulesValues = NSMutableAttributedString(string: "\n\(self.quizDetails?.quizRules ?? "")")
                rulesValues.setColorForText("\n\(self.quizDetails?.quizRules ?? "")", with: .darkGray)
                rulesValues.setFontForText("\n\(self.quizDetails?.quizRules ?? "")", with: UIFont(name: "Poppins-Medium", size: 14.0)!)
                
                rules.append(rulesValues)


                
                rankString.append(rules)

                cellMatch.lblValue.attributedText = rankString
            }
            return cellMatch
        default:
            return UITableViewCell()
        }
        
        
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        
        switch indexPath.row {
        case 0:
            return 135.0
        case 1:
            return 50
        default:
            return UITableView.automaticDimension
        }
        
    }
    
    func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return 0
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath)
    {
        
    }
    
}

extension SingleQuizContestDetailVC
{
    func CallSingleContestDetail()
    {
        let ApiFuture = APIClient.quizContestDetailWebService(contestID: self.quizID)
        
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
                    if ApiData.results != nil
                    {
                        self.quizDetails = ApiData.results!
                        self.dataCount = 3
                    }
                }
                
                self.tblView.reloadData()
            }
            
        }, onFailure: { error in
            print(error.localizedDescription)
            
        })
    }
    
    func CallSaveInviteCode(code:String)
    {
        let ApiFuture = APIClient.inviteUserCodeWebService(quiz_id: self.quizID, quiz_cat: self.categoryID, invite_code: code)
        
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
                    let vc = AppStoryboard.SingleQuiz.instance.instantiateViewController(withIdentifier: "InviteQuizViewController") as! InviteQuizViewController
                    vc.strShareCode = code
                    vc.quizDetails = self.quizDetails!
                    self.navigationController?.interactivePopGestureRecognizer?.isEnabled = false
                    self.navigationController?.pushViewController(vc, animated: true)
                    
                }
                
            }
            
        }, onFailure: { error in
            print(error.localizedDescription)
            
        })
    }
    
    
    
    func CallJoinSingleQuiz()
    {
        let ApiFuture = APIClient.joinContestWalletAmountWebService(game_type: "quiz", game_id: self.quizDetails?.id ?? "")
        
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
                    if let dataResponse = ApiData.results
                    {
                        var contestBalance = ContestFeeBalances()
                        contestBalance.cashBalance = Double("\(dataResponse.cashBalance?.value ?? "0.0")") ?? 0.0
                        contestBalance.winningBalance = Double("\(dataResponse.winningBalance?.value ?? "0.0")") ?? 0.0
                        contestBalance.usableBalance = Double("\(dataResponse.usableBonus?.value ?? "0.0")") ?? 0.0
                        contestBalance.entryFee = Double("\(dataResponse.entryFee?.value ?? "0.0")") ?? 0.0
                        contestBalance.useableBonousPercent = "\(dataResponse.useableBonousPercent?.value ?? "0")"
                        let myGameType = "inviteQuiz"



                        if contestBalance.entryFee - (contestBalance.usableBalance + contestBalance.cashBalance + contestBalance.winningBalance) <= 0
                        {

                            self.showInviteWalletPopupView(contestBalance, gameTypeValue: myGameType,inviteCode:self.strInviteCode, completionHandler: { receiveData in
                                print(receiveData)
                                Loaf("\(receiveData)", state: .custom(.init(backgroundColor: .black,textColor:.white, icon: nil, width: .screenPercentage(0.9))), location: .top, presentingDirection: .vertical, dismissingDirection: .vertical, sender: self).show(.short, completionHandler: .some({_ in

                                        

                                }))
                            })
                        }
                        else
                        {
                            let remainingBalance = contestBalance.entryFee - (contestBalance.usableBalance + contestBalance.cashBalance + contestBalance.winningBalance)

                            self.showMessage("Low balance!. Please add ₹\(String.init(format: "%.2f", arguments: [remainingBalance])) to join contest.", actionTitle: "Add Cash", callBack: {
                                let vc = AppStoryboard.Payment.instance.instantiateViewController(withIdentifier: "AddCashViewController") as! AddCashViewController
                                
                                vc.remainingBalance = remainingBalance
                                self.navigationController?.interactivePopGestureRecognizer?.isEnabled = false
                                self.navigationController?.pushViewController(vc, animated: false)

                            }, cancelCallback: nil)
                        }
                    }
                }
                else
                {
                    self.showMessageFromTop(message: "\(ApiData.msg?.value ?? "")")
                }
            }
            
        }, onFailure: { error in
            print(error.localizedDescription)
            //self.showMessageFromTop(message: error.underlyingError?.localizedDescription ?? error.localizedDescription)
        })
    }
}

