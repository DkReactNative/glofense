//
//  WalletPaymentPopup.swift
//  DreamNifty11
//
//  Created by octal on 02/03/20.
//  Copyright © 2020 octal. All rights reserved.
//

import UIKit
import AMPopTip

class WalletPaymentPopup: UIView {
    @IBOutlet weak var lblTotalBalance: UILabel!
    @IBOutlet weak var lblEntryFee: UILabel!
    @IBOutlet weak var lblBonus: UILabel!
    @IBOutlet weak var lblNetPay: UILabel!
    @IBOutlet weak var containerView: UIView!
    @IBOutlet weak var btnInfo: UIButton!
    @IBOutlet weak var btnJoin: UIButton!

    var teamId = String()
    var matchData:ContestDetailsResults?

    let popTip = PopTip()
    //var newContest = NewContestData()
    var isNewContest = false
    var useableBonousPercent = String()
    
    var completionHandler: ((String)->Void)?
    
    var gameType = String()
    var inviteCode = String()
    
    var contestBalance: ContestFeeBalances? {
        didSet{
            if let balance = self.contestBalance{

                if self.gameType == "quiz"
                {
                    self.btnJoin.setTitle("Join The Quiz", for: .normal)
                }
                else
                {
                    self.btnJoin.setTitle("Join The Contest", for: .normal)
                }
                self.lblEntryFee.text = "₹ " +  String(balance.entryFee.clean)
                self.lblNetPay.text = "₹ " +  String((balance.entryFee - balance.usableBalance).clean)
                self.lblBonus.text = " ₹ " + String(balance.usableBalance.clean)
                lblTotalBalance.text = "Unutilized Balance + Winnings = ₹ " + String((self.getDouble(for: balance.cashBalance + balance.winningBalance).rounded(toPlaces: 2)).clean)

                if balance.useableBonousPercent == "" || balance.useableBonousPercent.count == 0
                {
                    //self.btnInfoPopup.isHidden = true
                }
            }
        }
    }
    
    override func awakeFromNib() {
        super.awakeFromNib()
        self.updateDidLoad()
    }
    
    //Mark: - Functions
    
    func updateDidLoad()
    {
        print("MyGameType--->",self.gameType)
    }
    
    
    /*
    // Only override draw() if you perform custom drawing.
    // An empty implementation adversely affects performance during animation.
    override func draw(_ rect: CGRect) {
        // Drawing code
    }
    */
    
    @IBAction func InfoBtnPressed(_ sender: UIButton)
    {
        
        popTip.bubbleColor = UIColor.init(named: "PrimaryColor") ?? kAppPrimaryColor
        popTip.shouldDismissOnTapOutside = true
        popTip.shouldDismissOnTap = true
        popTip.show(text: "Max 10% of total entry fee* per match\n* valid for Selected contests only\n*not valid for private contests", direction: .down, maxWidth: 250, in: self.containerView, from: sender.frame)
    }
    
    @IBAction func onSubmitClick(_ sender: UIButton)
    {
        sender.isUserInteractionEnabled = false
        
//        if self.isNewContest
//        {
//            self.CallJoinNewContestApi()
//        }
//        else
//        {
    
            switch self.gameType {
             case "quiz":
                self.CallJoinQuizApi()
             case "contest":
                self.CallJoinContestApi()
             case "inviteQuiz":
                self.JoinInviteCode()
             default:
                print("NO")
            }
            
        //}
    }
    
    @IBAction func onCloseClick(_ sender: Any)
    {
        UIView.animate(withDuration: 0.3, animations: {
            self.alpha = 0.0
            self.containerView.transform = CGAffineTransform(translationX: 0, y: self.bounds.maxY)
        }) { _ in
            self.removeFromSuperview()
        }
    }
}

//MARK: - Api Calling
extension WalletPaymentPopup
{
    func CallJoinQuizApi()
    {
        let topController = UIApplication.shared.topMostViewController

        UIView.animate(withDuration: 0.3, animations: {
            self.alpha = 0.0
            self.containerView.transform = CGAffineTransform(translationX: 0, y: self.bounds.maxY)
        }) { _ in
            self.completionHandler?("Joined Successfully")
            self.removeFromSuperview()
        }
    }

    func JoinInviteCode()
    {
        let topController = UIApplication.shared.topMostViewController
        
        let ApiFuture = APIClient.joinInviteUserCodeWebService(invite_code: self.inviteCode)
        
        ApiFuture.execute(onSuccess:{ ApiData in
            if ApiData.auth ?? true == false
            {
                topController?.appDelegate.CallLogoutUser(false)
                return
            }
            else if "\(ApiData.isDeactivate?.value ?? "0")" == "1" || "\(ApiData.isDeactivate?.value ?? 0)" == "1"
            {
                topController?.showMessageFromTop(message: "Your account has been deactivated. Please contact to admin.")
                topController?.appDelegate.CallLogoutUser(true)
                return
            }
            else
            {
                if ApiData.success ?? false == true
                {
                    UIView.animate(withDuration: 0.3, animations: {
                        self.alpha = 0.0
                        self.containerView.transform = CGAffineTransform(translationX: 0, y: self.bounds.maxY)
                    }) { _ in
                        self.completionHandler?("\(ApiData.msg?.value ?? "Server Error")")
                        self.removeFromSuperview()
                    }
                }
                else
                {
                    UIView.animate(withDuration: 0.3, animations: {
                        self.alpha = 0.0
                        self.containerView.transform = CGAffineTransform(translationX: 0, y: self.bounds.maxY)
                    }) { _ in
                        topController?.showMessageFromTop(message: "\(ApiData.msg?.value ?? "Server Error")")
                        self.removeFromSuperview()
                    }
                }
                
            }
            
        }, onFailure: { error in
            print(error.localizedDescription)
            
        })
    }
    
    func CallJoinContestApi()
    {
        let topController = UIApplication.shared.topMostViewController

        let ApiFuture = APIClient.joinContestWebService(contest_id: matchData?.id ?? "")

        ApiFuture.execute(onSuccess:{ ApiData in
            if ApiData.auth ?? true == false
            {
                topController?.appDelegate.CallLogoutUser(false)
                return
            }
            else if "\(ApiData.isDeactivate?.value ?? "0")" == "1" || "\(ApiData.isDeactivate?.value ?? 0)" == "1"
            {
                topController?.showMessageFromTop(message: "Your account has been deactivated. Please contact to admin.")
                topController?.appDelegate.CallLogoutUser(true)
                return
            }
            else
            {
                if ApiData.success ?? false == true
                {
                    UIView.animate(withDuration: 0.3, animations: {
                        self.alpha = 0.0
                        self.containerView.transform = CGAffineTransform(translationX: 0, y: self.bounds.maxY)
                    }) { _ in
                        self.completionHandler?("\(ApiData.msg?.value ?? "Server Error")")
                        self.removeFromSuperview()
                    }

                }
                else
                {
                    UIView.animate(withDuration: 0.3, animations: {
                        self.alpha = 0.0
                        self.containerView.transform = CGAffineTransform(translationX: 0, y: self.bounds.maxY)
                    }) { _ in
                        topController?.showMessageFromTop(message: "\(ApiData.msg?.value ?? "Server Error")")
                        self.removeFromSuperview()
                    }
                }
            }

        }, onFailure: { error in
            print(error.localizedDescription)
            topController?.showMessageFromTop(message: error.localizedDescription)
        })
    }


}

extension UIViewController {

    func showWalletPopupView(_ booking: ContestFeeBalances? = nil,matchData:ContestDetailsResults? = nil,gameTypeValue:String, completionHandler: ((String)->Void)? = nil){
        if let window = view.window {
            if let ratingView = Bundle.main.loadNibNamed("WalletPaymentPopup", owner: nil, options: nil)?.first as? WalletPaymentPopup {
            
                ratingView.gameType = gameTypeValue
                ratingView.contestBalance = booking!
                ratingView.completionHandler = completionHandler
                if matchData != nil
                {
                    ratingView.matchData = matchData!
                }
                
                ratingView.frame = window.bounds
                ratingView.alpha = 0
                ratingView.containerView.transform = CGAffineTransform(translationX: 0, y: window.bounds.midY)
                window.addSubviewConstraint(to: ratingView)


                UIView.animate(withDuration: 0.75, delay: 0.0, usingSpringWithDamping: 0.5, initialSpringVelocity: 0.5, options: .curveEaseInOut, animations: {
                    ratingView.alpha = 1.0
                    ratingView.containerView.transform = .identity
                }) { _ in
                }
            }
        }
    }

    func showInviteWalletPopupView(_ booking: ContestFeeBalances? = nil,matchData:ContestDetailsResults? = nil,gameTypeValue:String,inviteCode:String, completionHandler: ((String)->Void)? = nil){
        if let window = view.window {
            if let ratingView = Bundle.main.loadNibNamed("WalletPaymentPopup", owner: nil, options: nil)?.first as? WalletPaymentPopup {
            
                ratingView.gameType = gameTypeValue
                ratingView.contestBalance = booking!
                ratingView.completionHandler = completionHandler
                if matchData != nil
                {
                    ratingView.matchData = matchData!
                }
                ratingView.inviteCode = inviteCode
                ratingView.frame = window.bounds
                ratingView.alpha = 0
                ratingView.containerView.transform = CGAffineTransform(translationX: 0, y: window.bounds.midY)
                window.addSubviewConstraint(to: ratingView)


                UIView.animate(withDuration: 0.75, delay: 0.0, usingSpringWithDamping: 0.5, initialSpringVelocity: 0.5, options: .curveEaseInOut, animations: {
                    ratingView.alpha = 1.0
                    ratingView.containerView.transform = .identity
                }) { _ in
                }
            }
        }
    }

    
//    func showNewContestWalletPopupView(_ booking: ContestFeeBalances? = nil,matchData:UpcomingMatch? = nil,teamId:String,isNewContest:Bool,contestData:NewContestData,gameType:String, completionHandler: ((String)->Void)? = nil){
//        if let window = view.window {
//            if let ratingView = Bundle.main.loadNibNamed("WalletPaymentPopup", owner: nil, options: nil)?.first as? WalletPaymentPopup {
//                ratingView.contestBalance = booking!
//                ratingView.completionHandler = completionHandler
//                ratingView.matchData = matchData!
//                ratingView.teamId = teamId
//                ratingView.isNewContest = isNewContest
//                ratingView.newContest = contestData
//                ratingView.gameType = gameType
//                ratingView.frame = window.bounds
//                ratingView.alpha = 0
//                ratingView.containerView.transform = CGAffineTransform(translationX: 0, y: window.bounds.midY)
//                window.addSubviewConstraint(to: ratingView)
//
//
//                UIView.animate(withDuration: 0.75, delay: 0.0, usingSpringWithDamping: 0.5, initialSpringVelocity: 0.5, options: .curveEaseInOut, animations: {
//                    ratingView.alpha = 1.0
//                    ratingView.containerView.transform = .identity
//                }) { _ in
//                }
//            }
//        }
//    }
}

struct ContestFeeBalances {
    var cashBalance = Double()
    var winningBalance = Double()
    var usableBalance = Double()
    var entryFee = Double()
    var useableBonousPercent = String()
    var gameType = String()
    var totalEntryFee = Double()
}

extension UIView {
    
    func addSubviewConstraint(to subView: UIView){
        
        subView.translatesAutoresizingMaskIntoConstraints = false
        addSubview(subView)
        let views: [String: Any] = ["alertView": subView]
        let horizontalConstraint = NSLayoutConstraint.constraints(withVisualFormat: "H:|[alertView]|", metrics: nil, views: views)
        let verticalConstraint = NSLayoutConstraint.constraints(withVisualFormat: "V:|[alertView]|", metrics: nil, views: views)
        NSLayoutConstraint.activate(horizontalConstraint+verticalConstraint)
        
    }
}

extension UIViewController {
    var topMostViewController : UIViewController {
        
        if let presented = self.presentedViewController {
            return presented.topMostViewController
        }
        
        if let navigation = self as? UINavigationController {
            return navigation.visibleViewController?.topMostViewController ?? navigation
        }
        
        if let tab = self as? UITabBarController {
            return tab.selectedViewController?.topMostViewController ?? tab
        }
        
        return self
    }
}
extension UIApplication {
    var topMostViewController : UIViewController? {
        return self.keyWindow?.rootViewController?.topMostViewController
    }
}
