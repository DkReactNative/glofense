//
//  APIRouter.swift
//  Networking
//
//  Created by Alaeddine Messaoudi on 26/11/2017.
//  Copyright © 2017 Alaeddine Me. All rights reserved.
//

import Alamofire

var kAppLanguage = "en"
var kAppDeviceId = "asdfghjkl"
var kAppDeviceType = "ios"
var kUserType = "user"

enum APIRouter: URLRequestConvertible {
    
    case login(phone:String)

    case verifyLoginOtp(otp:String,user_id:String)
    
    case resendOtp(userId:String)
    
    case loginWithPassword(email:String,password:String)
    
    case normalSignup(email:String,password:String,mobile:String,inviteCode:String,fName:String, lName:String,username:String)
    
    case socialSignup(email:String,password:String,mobile:String,inviteCode:String,google_id:String,fb_id:String,fName:String, lName:String,username:String,apple_id:String)
    
    case socialLogin(email:String,fb_id:String,google_id:String,apple_id:String)
    
    case forgotPassword(email:String)

    case logout

    case commanDetail

    case matchList(user_id:String,type:String)

    case quizContestList(quizCat:String,page:String,itemsPerPage:String)

    case categoryContestList(quizCat:String,page:String,itemsPerPage:String)
    
    case quizContestDetail(contestID:String)

    case contestDetail(contestID:String)
    
    case notificaions(page:String,itemsPerPage:String)
    
    case banners(page: String, itemPerPage:String)
    
    case staticPages(slug:String)
    
    case transactionHistory(page: String, itemPerPage:String)
    
    case news(page:String,itemsPerPage:String)

    case newsDetail(newsID:String)
    
    case userAccountDetail
        
    case applyCoupon(coupon_code:String)
    
    case verifyEmail(email:String)
        
    case personalDetails(user_id:String)
    
    case updatePersonalDetails(user_id: String,email:String,mobile:String,name:String,Dob:String,address:String,city:String,state:String,country:String,pincode:String,gender:String)
    
    case profile
    
    case editUserTeamName(user_id:String,team_name:String)
    
    case playerList(user_id: String,match_id:String,series_id:String)
    
    case createTeam(user_id: String,match_id:String,series_id:String,player_id:[[String:String]],type:String,captain:String,vice_captain:String)

    case editTeam(user_id: String,match_id:String,series_id:String,player_id:[[String:String]],type:String,team_id:String,captain:String,vice_captain:String)

    case playerTeamList(user_id: String,match_id:String,series_id:String,team_no:String)

    case joinContest(contest_id:String)

    case joinedContestList(page:String, itemsPerPage:String, status:String)

    case createTransactionId(order_id:String,txn_amount:String)

    case updateTransactions(order_id:String,txn_id:String,banktxn_id:String,txn_date:String,txn_amount:String,checksum:String,coupon_code:String,discount_amount:String)

    case joinContestWalletAmount(game_type: String,game_id:String)
    
    case joinedContestMatches(user_id:String,type:String)

    case addWithdrawRequest(request_amount: String)

    case friendReferalDetail(user_id:String)

    case withdrawCash(user_id:String)

    case bankDetails

    case entryPerTeam(user_id: String,contest_size:String,winning_amount:String)

    case switchTeam(user_id: String,match_id:String,series_id:String,contest_id:String,prev_team_id:String,switch_team_id:String)

    case createContest(user_id: String,match_id:String,series_id:String,contest_size:String,team_id:String,winners_count:String,entry_fee:String,contest_name:String,game_type:String,winning_amount:String,join_multiple:String,team_count:String)

    case applyContestInviteCode(user_id: String,invite_code:String)

    case switchTargetTeam(user_id: String,match_id:String,series_id:String,contest_id:String,prev_team_id:String,switch_team_id:String)

    case contestTeamCount(user_id: String,series_id:String,match_id:String,game_type:String)

    case contestPrizeBreakup(user_id: String,contest_size:String)

    case getSeriesPlayerList(user_id: String,match_id:String,series_id:String,contest_id:String)

    case getPreviousCloseTarget(user_id: String,match_id:String,series_id:String)

    case createTargetTeam(user_id: String,match_id:String,series_id:String,previous_close:String,point_up_down:String,predict_close:String)
    
    case editTargetTeam(user_id: String,match_id:String,series_id:String,previous_close:String,point_up_down:String,predict_close:String,team_id:String)
    
    case targetTeamList(user_id: String,match_id:String,series_id:String,team_no:String)

    case joinTargetContest(user_id: String,match_id:String,series_id:String,contest_id:String,team_id:String)
    
    case joinedTargetContestList(user_id: String,match_id:String,series_id:String)

    case stockCompanyState(user_id: String,match_id:String,series_id:String)

    case leaderboard(user_id: String,match_id:String,series_id:String,contest_id:String,game_type:String)

    case joinedContestTargetMatches(user_id: String, type:String)
    
    case teamProfileComparision(user_id: String,friend_user_id:String)
    
    case deleteNotifications(id:String)
    
    case changePassword(old_password:String, password:String)

    case category(page: String, itemPerPage:String)
    
    case onlineSearch(quiz_id:String)
    
    case matchCompleted(match_id:String)
    
    case accountStatement(page:String,itemsPerPage:String)
    
    case contestQuestions(contest_id:String)
    
    case inviteUserCode(quiz_id:String,quiz_cat:String,invite_code:String)
    
    case verifyInviteUserCode(invite_code:String)
    
    case joinInviteUser(invite_code:String)
    
    case inviteUserQuestion(match_id:String)
    
    case videosList(page:String,itemsPerPage:String)
    
    case adsList(page:String,itemsPerPage:String)
    // MARK: - HTTPMethod
    private var method: HTTPMethod {
        switch self {
        case .login,
             .verifyLoginOtp,
             .resendOtp,
             .loginWithPassword,
             .normalSignup,
             .socialSignup,
             .socialLogin,
             .forgotPassword,
             .matchList,
             .applyCoupon,
             .verifyEmail:
            return .post
        case .personalDetails,
             .updatePersonalDetails,
             .editUserTeamName:
            return .post
        case .playerList:
            return .post
        case .createTeam:
            return .post
        case .editTeam:
            return .post
        case .playerTeamList:
            return .post
        case .joinContest:
            return .post
        case .joinedContestList:
            return .get
        case .createTransactionId:
            return .post
        case .updateTransactions:
            return .post
        case .joinContestWalletAmount:
            return .post
        case .joinedContestMatches,
             .addWithdrawRequest,
             .friendReferalDetail,
             .withdrawCash,
             .entryPerTeam,
             .switchTeam,
             .createContest,
             .applyContestInviteCode,
             .switchTargetTeam,
             .contestTeamCount,
             .contestPrizeBreakup,
             .getSeriesPlayerList:
            return .post
        case .getPreviousCloseTarget,
             .createTargetTeam,
             .editTargetTeam,
             .targetTeamList,
             .joinTargetContest,
             .joinedTargetContestList,.stockCompanyState,.leaderboard,.joinedContestTargetMatches,.teamProfileComparision,.deleteNotifications, .changePassword, .onlineSearch:
            return .post
        case .staticPages,.profile, .banners, .category, .quizContestList, .categoryContestList:
            return .get
        case .quizContestDetail,.notificaions,.contestDetail,.commanDetail,.userAccountDetail,.news,.newsDetail,.transactionHistory,.accountStatement,.logout,.bankDetails,.videosList,.adsList:
            return .get
        case .matchCompleted,.contestQuestions,.inviteUserCode,.verifyInviteUserCode,.joinInviteUser,.inviteUserQuestion:
            return .post
        }
    }
    
    // MARK: - Path
    private var path: String {
        switch self {
          case .login:
             return "api/users/login"
          case .verifyLoginOtp:
             return "api/users/verify-otp"
          case .resendOtp:
             return "api/users/resend-otp"
          case .loginWithPassword:
             return "api/users/login"
          case .normalSignup:
             return "api/users/register"
          case .socialSignup:
             return "api/users/register"
          case .socialLogin:
             return "api/users/social-login"
          case .forgotPassword:
             return "api/users/forgot-password"
          case .logout:
             return "api/users/logout"
          case .commanDetail:
             return "api/users/get-comman-details"
          case .matchList:
             return "webServicesStock/getMatchList"
          case .quizContestList(let quizCat, let page, let itemPerPage):
             return "api/users/get-quizzes?page=\(page)&itemsPerPage=\(itemPerPage)&quizCat=\(quizCat)"
          case .categoryContestList(let quizCat, let page, let itemPerPage):
             return "api/users/get-contests?page=\(page)&itemsPerPage=\(itemPerPage)&quizCat=\(quizCat)"
          case .notificaions(let page, let itemPerPage):
             return "api/users/get-notification?page=\(page)&itemsPerPage=\(itemPerPage)"
          case .banners(let page, let itemPerPage):
             return "api/users/get-banners?page=\(page)&itemsPerPage=\(itemPerPage)"
          case .staticPages(let slug):
             return "api/users/get-page-by-slug/\(slug)"
          case .transactionHistory(let page, let itemPerPage):
             return "api/users/get-transactions?page=\(page)&itemsPerPage=\(itemPerPage)"
          case .news(let page, let itemPerPage):
             return "api/users/get-news?page=\(page)&itemsPerPage=\(itemPerPage)"
          case .newsDetail(let newsID):
             return "api/users/get-news/\(newsID)"
          case .userAccountDetail:
             return "api/users/get-account-details"
          case .applyCoupon:
             return "api/users/apply-couppon"
          case .verifyEmail:
             return "api/users/send-verify-email"
          case .personalDetails:
             return "api/users/get-profile"
          case .updatePersonalDetails:
             return "api/users/profile"
          case .profile:
             return "api/users/get-profile"
          case .editUserTeamName:
             return "webServices/edit_user_team_name"
          case .playerList:
             return "webServicesStock/playerList"
          case .createTeam:
             return "webServicesStock/createTeam"
          case .editTeam:
             return "webServicesStock/createTeam"
          case .playerTeamList:
             return "webServicesStock/playerTeamList"
          case .joinContest:
             return "api/users/join-contest"
          case .joinedContestList(let page, let itemsPerPage, let status):
             return "api/users/upcoming-contest?page=\(page)&itemsPerPage=\(itemsPerPage)&match_status=\(status)"
          case .createTransactionId:
             return "api/users/create-transactionId"
          case .updateTransactions:
             return "api/users/update-transaction"
          case .joinContestWalletAmount:
             return "api/users/check-wallet"
          case .joinedContestMatches:
             return "webServicesStock/joined-contest-matches"
          case .addWithdrawRequest:
             return "api/users/request-withdraw"
          case .friendReferalDetail:
             return "webServices/friendReferalDetail"
          case .withdrawCash:
             return "webServices/withdrawCash"
          case .bankDetails:
             return "api/users/get-bank-details"
          case .entryPerTeam:
             return "webServices/entryPerTeam"
          case .switchTeam:
             return "webServicesStock/switchTeam"
          case .createContest:
             return "webServicesStock/createContest"
          case .applyContestInviteCode:
             return "webServicesStock/applyContestInviteCode"
          case .switchTargetTeam:
             return "webServicesStock/switchTargetTeam"
          case .contestTeamCount:
             return "webServicesStock/contestTeamCount"
          case .contestPrizeBreakup:
             return "webServices/contestPrizeBreakup"
          case .getSeriesPlayerList:
             return "webServicesStock/getSeriesPlayerList"
          case .getPreviousCloseTarget:
            return "webServicesStock/getPreviousCloseTarget"
          case .createTargetTeam:
            return "webServicesStock/createTargetTeam"
          case .editTargetTeam:
            return "webServicesStock/createTargetTeam"
          case .targetTeamList:
            return "webServicesStock/targetTeamList"
          case .joinTargetContest:
            return "webServicesStock/joinTargetContest"
          case .joinedTargetContestList:
            return "webServicesStock/joinedTargetContestList"
          case .stockCompanyState:
            return "webServicesStock/stockCompanyState"
          case .leaderboard:
            return "webServicesStock/leaderboard"
          case .joinedContestTargetMatches:
            return "webServicesStock/joined-contest-matches"
          case .teamProfileComparision:
            return "webServices/teamProfileComparision"
          case .deleteNotifications:
            return "api/users/clear-notification"
          case .changePassword:
            return "api/users/change-password"
          case .category(let page, let itemPerPage):
            return "api/users/get-quiz-categories?page=\(page)&itemsPerPage=\(itemPerPage)"
          case .contestDetail(let contestID):
            return "api/users/get-contest/\(contestID)"
          case .quizContestDetail(let contestID):
            return "api/users/get-quiz/\(contestID)"
          case .onlineSearch:
            return "api/users/online-user-search"
          case .matchCompleted:
            return "api/users/match-completed"
          case .accountStatement(let page, let itemsPerPage):
            return "api/users/account-statement?page=\(page)&itemsPerPage=\(itemsPerPage)"
            
          case .contestQuestions:
            return "api/users/contest-questions"
            
          case .inviteUserCode:
            return "api/users/invite-user"
            
        case .verifyInviteUserCode:
            return "api/users/verify-invite-code"
            
        case .joinInviteUser:
            return "api/users/join-invite-user"
            
        case .inviteUserQuestion:
            return "api/users/invite-user-question"
            
        case .videosList(let page, let itemPerPage):
           return "api/users/get-videos?page=\(page)&itemsPerPage=\(itemPerPage)"
       
        case .adsList(let page, let itemPerPage):
           return "api/users/get-ads?page=\(page)&itemsPerPage=\(itemPerPage)"
            
        }
    }
    
    private var encoding:URLEncoding? {
        switch self {
        case .login:
            return .httpBody
        case .normalSignup:
            return .httpBody
        default:
            return .httpBody
        }
    }
    
    // MARK: - Parameters
    private var parameters: Parameters? {
        switch self {
        case .login(let mobile):
            return [K.APIParameterKey.user_name: mobile,
                    K.APIParameterKey.language:kAppLanguage]
            
        case .verifyLoginOtp(let otp, let user_id):
            return [K.APIParameterKey.otp: otp,
                    K.APIParameterKey.user_id:user_id,
                    K.APIParameterKey.device_id:kAppDeviceId,
                    K.APIParameterKey.device_type:kAppDeviceType]
            
        case .resendOtp(let userId):
            return [K.APIParameterKey.user_id: userId]
            
        case .loginWithPassword(let email, let password):
            return [K.APIParameterKey.email: email,
                    K.APIParameterKey.password: password,
                    K.APIParameterKey.user_type:kUserType,
                    K.APIParameterKey.device_id:kAppDeviceId,
                    K.APIParameterKey.device_type:kAppDeviceType]
            
        case .normalSignup(let email, let password, let mobile, let inviteCode, let fName, let lName, let username):
            return [K.APIParameterKey.email: email,
                    K.APIParameterKey.password: password,
                    K.APIParameterKey.phone:mobile,
                    K.APIParameterKey.referral_code:inviteCode,
                    K.APIParameterKey.firstName:fName,
                    K.APIParameterKey.lastName:lName,
                    K.APIParameterKey.device_id:kAppDeviceId,
                    K.APIParameterKey.device_type:kAppDeviceType,
                    K.APIParameterKey.username:username]
            
        case .socialSignup(let email, let password, let mobile, let inviteCode, let google_id, let fb_id, let fName, let lName, let username, let apple_id):
            return [K.APIParameterKey.email: email,
                    K.APIParameterKey.password: password,
                    K.APIParameterKey.phone:mobile,
                    K.APIParameterKey.referral_code:inviteCode,
                    K.APIParameterKey.firstName:fName,
                    K.APIParameterKey.lastName:lName,
                    K.APIParameterKey.google_id:google_id,
                    K.APIParameterKey.fb_id:fb_id,
                    K.APIParameterKey.apple_id: apple_id,
                    K.APIParameterKey.device_id:kAppDeviceId,
                    K.APIParameterKey.device_type:kAppDeviceType,
                    K.APIParameterKey.username:username]
            
        case .socialLogin(let email, let fb_id, let google_id, let apple_id):
            return [K.APIParameterKey.email: email,
                    K.APIParameterKey.google_id:google_id,
                    K.APIParameterKey.fb_id:fb_id,
                    K.APIParameterKey.apple_id: apple_id,
                    K.APIParameterKey.device_id:kAppDeviceId,
                    K.APIParameterKey.device_type:kAppDeviceType]
            
            
        case .forgotPassword(let email):
            return [K.APIParameterKey.email: email,
                    K.APIParameterKey.language:kAppLanguage]
            
        case .logout:
            return nil
            
        case .commanDetail:
            return nil
            
        case .matchList(let user_id, let type):
            return [K.APIParameterKey.user_id: user_id,
                    K.APIParameterKey.type: type,
                    K.APIParameterKey.language:kAppLanguage]
            
        case .quizContestList(_,_,_):
            return nil
            
        case .categoryContestList(_,_,_):
            return nil
        
        case .contestDetail(_):
            return nil
            
        case .quizContestDetail(_):
            return nil
            
        case .notificaions(_,_):
            return nil
            
        case .banners(_,_):
            return nil
            
        case .staticPages(_):
            return nil
            
        case .transactionHistory(_,_):
            return nil
            
        case .news(_,_):
            return nil
        
        case .newsDetail(_):
            return nil
            
        case .userAccountDetail:
            return nil
            
        case .applyCoupon(let coupon_code):
            return [K.APIParameterKey.coupon_code: coupon_code]
            
        case .verifyEmail(let email):
            return [K.APIParameterKey.email: email]
            
        case .personalDetails(let user_id):
            return [K.APIParameterKey.user_id: user_id,
                    K.APIParameterKey.language:kAppLanguage]

        case .updatePersonalDetails(let user_id, let email, let mobile,let name ,let Dob, let address, let city, let state, let country, let pincode, let gender):
            return [K.APIParameterKey.user_id: user_id,
                    K.APIParameterKey.email: email,
                    K.APIParameterKey.mobile: mobile,
                    K.APIParameterKey.name: name,
                    K.APIParameterKey.date_of_birth: Dob,
                    K.APIParameterKey.address: address,
                    K.APIParameterKey.city: city,
                    K.APIParameterKey.state: state,
                    K.APIParameterKey.country: country,
                    K.APIParameterKey.pincode: pincode,
                    K.APIParameterKey.gender: gender,
                    K.APIParameterKey.language:kAppLanguage]
            
        case .profile:
            return nil
            
        case .editUserTeamName(let user_id, let team_name):
            return [K.APIParameterKey.user_id: user_id,
                    K.APIParameterKey.team_name: team_name,
                    K.APIParameterKey.language:kAppLanguage]

        case .playerList(let user_id, let match_id, let series_id):
            return [K.APIParameterKey.user_id: user_id,
                    K.APIParameterKey.match_id: match_id,
                    K.APIParameterKey.series_id: series_id,
                    K.APIParameterKey.language:kAppLanguage]
            

        case .createTeam(let user_id, let match_id, let series_id, let player_id, let type, let captain, let vice_captain):
            return [K.APIParameterKey.user_id: user_id,
                    K.APIParameterKey.match_id: match_id,
                    K.APIParameterKey.series_id: series_id,
                    K.APIParameterKey.player_id:player_id,
                    K.APIParameterKey.type :type,
                    K.APIParameterKey.language:kAppLanguage,
                    K.APIParameterKey.team_id : "",
                    K.APIParameterKey.captain:captain,
                    K.APIParameterKey.vice_captain:vice_captain]
            
        case .editTeam(let user_id, let match_id, let series_id, let player_id, let type, let team_id,  let captain, let vice_captain):
            return [K.APIParameterKey.user_id: user_id,
                    K.APIParameterKey.match_id: match_id,
                    K.APIParameterKey.series_id: series_id,
                    K.APIParameterKey.player_id:player_id,
                    K.APIParameterKey.type :type,
                    K.APIParameterKey.team_id:team_id,
                    K.APIParameterKey.language:kAppLanguage,
                    K.APIParameterKey.captain:captain,
                    K.APIParameterKey.vice_captain:vice_captain]
            
        case .playerTeamList(let user_id, let match_id, let series_id,let team_no):
            return [K.APIParameterKey.user_id: user_id,
                    K.APIParameterKey.match_id: match_id,
                    K.APIParameterKey.series_id: series_id,
                    K.APIParameterKey.team_no:team_no,
                    K.APIParameterKey.language:kAppLanguage]
        
        case .joinContest(let contest_id):
            return [K.APIParameterKey.contest_id:contest_id]
        
        case .joinedContestList(_,_,_):
            return nil
            
        case .createTransactionId(let order_id, let txn_amount):
            return [K.APIParameterKey.order_id: order_id,
                    K.APIParameterKey.txn_amount: txn_amount]
            
        case .updateTransactions(let order_id, let txn_id, let banktxn_id, let txn_date, let txn_amount, let checksum, let coupon_code, let discount_amount):
            return [K.APIParameterKey.order_id: order_id,
                    K.APIParameterKey.txn_id: txn_id,
                    K.APIParameterKey.banktxn_id: banktxn_id,
                    K.APIParameterKey.txn_date: txn_date,
                    K.APIParameterKey.txn_amount: txn_amount,
                    K.APIParameterKey.checksum: checksum,
                    K.APIParameterKey.gateway_name: "CASH_FREE",
                    K.APIParameterKey.currency:"INR",
                    K.APIParameterKey.coupon_code:coupon_code,
                    K.APIParameterKey.coupon_cashback_amount:discount_amount,
                    K.APIParameterKey.language:kAppLanguage]
            
        case .joinContestWalletAmount(let game_type, let game_id):
            return [K.APIParameterKey.game_type: game_type,
                    K.APIParameterKey.game_id: game_id]
            
        case .joinedContestMatches(let user_id, let type):
            return [K.APIParameterKey.user_id: user_id,
                    K.APIParameterKey.type: type,
                    K.APIParameterKey.language:kAppLanguage]
            
        case .addWithdrawRequest(let request_amount):
            return [K.APIParameterKey.request_amount: request_amount]
            
        case .friendReferalDetail(let user_id):
            return [K.APIParameterKey.user_id: user_id,
                    K.APIParameterKey.language:kAppLanguage]
            
        case .withdrawCash(let user_id):
            return [K.APIParameterKey.user_id: user_id,
                    K.APIParameterKey.language:kAppLanguage]
            
        case .bankDetails:
            return nil
            
        case .entryPerTeam(let user_id, let contest_size, let winning_amount):
            return [K.APIParameterKey.user_id: user_id,
                    K.APIParameterKey.contest_size: contest_size,
                    K.APIParameterKey.winning_amount: winning_amount,
                    K.APIParameterKey.language:kAppLanguage]
            
        case .switchTeam(let user_id, let match_id, let series_id, let contest_id, let prev_team_id, let switch_team_id):
            return [K.APIParameterKey.user_id: user_id,
                    K.APIParameterKey.series_id: series_id,
                    K.APIParameterKey.match_id: match_id,
                    K.APIParameterKey.contest_id: contest_id,
                    K.APIParameterKey.prev_team_id: prev_team_id,
                    K.APIParameterKey.switch_team_id: switch_team_id,
                    K.APIParameterKey.language:kAppLanguage]
            
        case .createContest(let user_id, let match_id, let series_id, let contest_size, let team_id, let winners_count, let entry_fee, let contest_name, let game_type, let winning_amount, let join_multiple, let team_count):
            return [K.APIParameterKey.user_id: user_id,
                    K.APIParameterKey.series_id: series_id,
                    K.APIParameterKey.match_id: match_id,
                    K.APIParameterKey.contest_size: contest_size,
                    K.APIParameterKey.team_id: team_id,
                    K.APIParameterKey.winners_count: winners_count,
                    K.APIParameterKey.entry_fee: entry_fee,
                    K.APIParameterKey.contest_name: contest_name,
                    K.APIParameterKey.game_type: game_type,
                    K.APIParameterKey.winning_amount: winning_amount,
                    K.APIParameterKey.join_multiple: join_multiple,
                    K.APIParameterKey.language:kAppLanguage,
                    K.APIParameterKey.team_count:team_count]
            
        case .applyContestInviteCode(let user_id, let invite_code):
            return [K.APIParameterKey.user_id: user_id,
                    K.APIParameterKey.invite_code: invite_code,
                    K.APIParameterKey.language:kAppLanguage]
            
        case .switchTargetTeam(let user_id, let match_id, let series_id, let contest_id, let prev_team_id, let switch_team_id):
            return [K.APIParameterKey.user_id: user_id,
                    K.APIParameterKey.series_id: series_id,
                    K.APIParameterKey.match_id: match_id,
                    K.APIParameterKey.contest_id: contest_id,
                    K.APIParameterKey.prev_team_id: prev_team_id,
                    K.APIParameterKey.switch_team_id: switch_team_id,
                    K.APIParameterKey.language:kAppLanguage]
            
        case .contestTeamCount(let user_id, let series_id, let match_id, let game_type):
            return [K.APIParameterKey.user_id: user_id,
                    K.APIParameterKey.series_id: series_id,
                    K.APIParameterKey.match_id: match_id,
                    K.APIParameterKey.game_type: game_type,
                    K.APIParameterKey.language:kAppLanguage]
            
        case .contestPrizeBreakup(let user_id, let contest_size):
            return [K.APIParameterKey.user_id: user_id,
                    K.APIParameterKey.contest_size: contest_size,
                    K.APIParameterKey.language:kAppLanguage]
            
        case .getSeriesPlayerList(let user_id, let match_id, let series_id, let contest_id):
            return [K.APIParameterKey.user_id: user_id,
                    K.APIParameterKey.match_id: match_id,
                    K.APIParameterKey.series_id: series_id,
                    K.APIParameterKey.contest_id: contest_id,
                    K.APIParameterKey.language:kAppLanguage]
        
        case .getPreviousCloseTarget(let user_id, let match_id, let series_id):
            return [K.APIParameterKey.user_id: user_id,
                    K.APIParameterKey.match_id: match_id,
                    K.APIParameterKey.series_id: series_id,
                    K.APIParameterKey.language:kAppLanguage]
        
        case .createTargetTeam(let user_id, let match_id, let series_id, let previous_close, let point_up_down, let predict_close):
            return [K.APIParameterKey.user_id: user_id,
                    K.APIParameterKey.match_id: match_id,
                    K.APIParameterKey.series_id: series_id,
                    K.APIParameterKey.previous_close:previous_close,
                    K.APIParameterKey.point_up_down:point_up_down,
                    K.APIParameterKey.predict_close: predict_close,
                    K.APIParameterKey.language:kAppLanguage]
        
        case .editTargetTeam(let user_id, let match_id, let series_id, let previous_close, let point_up_down,let predict_close, let team_id):
            return [K.APIParameterKey.user_id: user_id,
                    K.APIParameterKey.match_id: match_id,
                    K.APIParameterKey.series_id: series_id,
                    K.APIParameterKey.previous_close:previous_close,
                    K.APIParameterKey.point_up_down:point_up_down,
                    K.APIParameterKey.predict_close: predict_close,
                    K.APIParameterKey.team_id:team_id,
                    K.APIParameterKey.language:kAppLanguage]
        
        case .targetTeamList(let user_id, let match_id, let series_id, let team_no):
            return [K.APIParameterKey.user_id: user_id,
                    K.APIParameterKey.match_id: match_id,
                    K.APIParameterKey.series_id: series_id,
                    K.APIParameterKey.team_no: team_no,
                    K.APIParameterKey.language:kAppLanguage]
        
        case .joinTargetContest(let user_id, let match_id, let series_id, let contest_id, let team_id):
            return [K.APIParameterKey.user_id: user_id,
                    K.APIParameterKey.match_id: match_id,
                    K.APIParameterKey.series_id: series_id,
                    K.APIParameterKey.contest_id: contest_id,
                    K.APIParameterKey.team_id: team_id,
                    K.APIParameterKey.language:kAppLanguage]
        
        case .joinedTargetContestList(let user_id, let match_id, let series_id):
            return [K.APIParameterKey.user_id: user_id,
                    K.APIParameterKey.match_id: match_id,
                    K.APIParameterKey.series_id: series_id,
                    K.APIParameterKey.language:kAppLanguage]
     
        case .stockCompanyState(let user_id, let match_id, let series_id):
            return [K.APIParameterKey.user_id: user_id,
                    K.APIParameterKey.match_id: match_id,
                    K.APIParameterKey.series_id: series_id,
                    K.APIParameterKey.language:kAppLanguage]
     
        case .leaderboard(let user_id, let match_id, let series_id, let contest_id, let game_type):
            return [K.APIParameterKey.user_id: user_id,
                    K.APIParameterKey.match_id: match_id,
                    K.APIParameterKey.series_id: series_id,
                    K.APIParameterKey.contest_id: contest_id,
                    K.APIParameterKey.game_type: game_type,
                    K.APIParameterKey.language:kAppLanguage]
       
        case .joinedContestTargetMatches(let user_id, let type):
            return [K.APIParameterKey.user_id: user_id,
                    K.APIParameterKey.type: type,
                    K.APIParameterKey.language:kAppLanguage]
      
        case .teamProfileComparision(let user_id, let friend_user_id):
            return [K.APIParameterKey.user_id: user_id,
            K.APIParameterKey.friend_user_id: friend_user_id,
            K.APIParameterKey.language:kAppLanguage]
       
        case .deleteNotifications(let id):
            return [K.APIParameterKey.id: id]
       
        case .changePassword(let old_password, let password):
            return [K.APIParameterKey.oldPassword: old_password,
                    K.APIParameterKey.newPassword:password]
            
        case .category(_, _):
            return nil
            
        case .onlineSearch(let quiz_id):
            return [K.APIParameterKey.quiz_id:quiz_id]
            
        case .matchCompleted(let match_id):
            return [K.APIParameterKey.match_id:match_id,K.APIParameterKey.status:"completed"]
            
        case .accountStatement(_,_):
            return nil
            
        case .contestQuestions(let contest_id):
            return [K.APIParameterKey.contest_id:contest_id]
            
        case .inviteUserCode(let quiz_id, let quiz_cat, let invite_code):
            return [K.APIParameterKey.quiz_id:quiz_id,
                    K.APIParameterKey.quiz_cat:quiz_cat,
                    K.APIParameterKey.invite_code:invite_code]
            
        case .verifyInviteUserCode(let invite_code):
            return [K.APIParameterKey.invite_code:invite_code]
            
        case .joinInviteUser(let invite_code):
            return [K.APIParameterKey.invite_code:invite_code]
            
        case .inviteUserQuestion(let match_id):
            return [K.APIParameterKey.match_id:match_id]
            
        case .videosList(_,_):
            return nil
            
        case .adsList(_,_):
            return nil
        }
    }
    
    // MARK: - URLRequestConvertible
    func asURLRequest() throws -> URLRequest
    {
        let url = try K.ProductionServer.baseURL.asURL()
        
        let urlString:String = url.absoluteString.appending("/\(path)")

        var urlRequest = URLRequest(url: URL(string: urlString)!)
        AppDelegate.print("URL ==> \(urlRequest.url!)\n\n")
        
        // HTTP Method
        urlRequest.httpMethod = method.rawValue
        urlRequest.timeoutInterval = 180.0

        switch self {
        case .login,
             .verifyLoginOtp,
             .forgotPassword,
             .resendOtp,
             .socialLogin,
             .socialSignup,
             .normalSignup,
             .loginWithPassword,
             .staticPages:
            // Common Headers
            urlRequest.setValue(ContentType.json.rawValue, forHTTPHeaderField: HTTPHeaderField.acceptType.rawValue)
            urlRequest.setValue(ContentType.urlEncode.rawValue, forHTTPHeaderField: HTTPHeaderField.contentType.rawValue)
            
            
            break
        case .banners, .category:
            
            AppDelegate.print("Token--->",defaults[.authToken])
            
            urlRequest.setValue(defaults[.authToken], forHTTPHeaderField: HTTPHeaderField.xaccesstoken.rawValue)
            urlRequest.setValue(ContentType.json.rawValue, forHTTPHeaderField: HTTPHeaderField.acceptType.rawValue)
            urlRequest.setValue(ContentType.json.rawValue, forHTTPHeaderField: HTTPHeaderField.contentType.rawValue)
            
        default:
            // Common Headers
            AppDelegate.print("Token--->",defaults[.authToken])
            
            urlRequest.setValue(defaults[.authToken], forHTTPHeaderField: HTTPHeaderField.xaccesstoken.rawValue)
            urlRequest.setValue(ContentType.json.rawValue, forHTTPHeaderField: HTTPHeaderField.acceptType.rawValue)
            urlRequest.setValue(ContentType.urlEncode.rawValue, forHTTPHeaderField: HTTPHeaderField.contentType.rawValue)
            

        }
        
        
        // Parameters
        if let parameters = parameters {
            AppDelegate.print("parameters===> ",parameters.toJson())
            
            urlRequest.httpBody =  parameters.queryParameters.data(using: .utf8)
        }
        
        return urlRequest
    }
}

extension Dictionary {
    var queryParameters: String {
        var parts: [String] = []
        for (key, value) in self {
            let part = String(format: "%@=%@",
                              String(describing: key).addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)!,
                              String(describing: value).addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)!)
            parts.append(part as String)
        }
        return parts.joined(separator: "&")
    }

}


public enum RequestStatus: Int
{
    case OK             = 200
    case noAccount      = 201
    case error          = 202
    case notVerified    = 203
    case tokenExpire    = 403
    case requestDenied  = 401
    case invalidRequest = 400
}

public enum ApiName: String{
    
    case login                 = "login"
    case logout                = "stylist_logout"
    case signup                = "registers"
    case forgotPassword        = "forgotpassword"
    case changePassword        = "changePassword"
    case getProfileDetails     = "getProfileDetails"
    case updateProfilePic      = "updateProfilePic"
    case verifyOtp             = "otpVerification"
    case advertisement         = "get_advertisement"
    case notifications         = "get_user_notifications"
    case addFeedback           = "addFeedback"
    case addressList           = "deliveryAddressList"
    case addAddress            = "deliveryAddress"
    case editAddress           = "UpdatedeliveryAddress"
    case deleteAddress         = "deletedeliveryAddress"
    case getCategoryList       = "getsub_cat"
    case getSubCategoryList    = "getsubcatBycat"
    case getChildCategory      = "getchildcatBysubCat"
    case getCartCount          = "getCartCount"
    case getProductList        = "getproductbychildcat"
    case getProductDetail      = "getProductsDetails"
    case myOrders              = "getuserOrderHistory"
    case addToCart             = "addtocart"
    case cartDetail            = "getuserCartDetails"
    case deleteCart            = "deletecart"
    case updateCart            = "qtyChange"
    case bookNow               = "confirmedOrder"
    case confirmOrder          = "confirmOrder"
    case pincodes              = "getPincode"
    case cancelledOrder        = "callcelledOrder"
    case cancelledOrderItem    = "cancelledOrder_Item"
    case LatestProductsDetails = "getLatestProductsDetails"
    case brands                = "getbrands"
    case getAllReviews         = "getEventsRatingDetails"
    case addReview             = "rating_review"
    case verifyPanDetail       = "verifyPanDetail"
    case verifyBankDetail      = "verifyBankDetail"

}


private var header: [String: String] {
    
    let header: [String: String] = [
        "Content-Type":"application/json",
        "Accept":"application/json"
    ]
    
//    if let sessionToken = defaults[.sessionToken].value{
//        header["Authorization"] = "Bearer \(sessionToken)"
//    }
    return header
}

private var postHeader: [String: String] {
    
    var header: [String: String] = [
        "content-type": "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
        "Content-Type": "application/x-www-form-urlencoded"
    ]
    
    //    if let sessionToken = defaults[.sessionToken].value{
    //        header["Authorization"] = "Bearer \(sessionToken)"
    //    }
    return header
}

extension Dictionary {
    func toJson() -> String {
        let jsonData = try! JSONSerialization.data(withJSONObject: self, options: [])
        let jsonString = NSString(data: jsonData, encoding: String.Encoding.utf8.rawValue)! as String
        AppDelegate.print("JSON string = \(jsonString)")
        
        return jsonString
    }
    
    func nullKeyRemoval() -> [AnyHashable: Any] {
        var dict: [AnyHashable: Any] = self
        
        let keysToRemove = dict.keys.filter { dict[$0] is NSNull }
        let keysToCheck = dict.keys.filter({ dict[$0] is Dictionary })
        for key in keysToRemove {
            dict.removeValue(forKey: key)
        }
        for key in keysToCheck {
            if let valueDict = dict[key] as? [AnyHashable: Any] {
                dict.updateValue(valueDict.nullKeyRemoval(), forKey: key)
            }
        }
        return dict
    }
}

extension NSDictionary {
    func toJson() {
        let jsonData = try! JSONSerialization.data(withJSONObject: self, options: JSONSerialization.WritingOptions.prettyPrinted)
        let jsonString = NSString(data: jsonData, encoding: String.Encoding.utf8.rawValue)
        AppDelegate.print("JSON string = \(jsonString ?? "")")
    }
    
    func removeNullValueFromDict()-> NSDictionary
    {
        let mutableDictionary:NSMutableDictionary = NSMutableDictionary(dictionary: self)
        for key in mutableDictionary.allKeys
        {
            if("\(mutableDictionary.object(forKey: "\(key)")!)" == "<null>")
            {
                mutableDictionary.setValue("", forKey: key as! String)
            }
            else if((mutableDictionary.object(forKey: "\(key)")! as AnyObject).isKind(of: NSNull.classForCoder()))
            {
                mutableDictionary.setValue("", forKey: key as! String)
            }
            else if ((mutableDictionary.object(forKey: "\(key)")! as AnyObject).isKind(of: NSDictionary.classForCoder()))
            {
                mutableDictionary.setValue((mutableDictionary.object(forKey: "\(key)")! as! NSDictionary).removeNullValueFromDict(), forKey: key as! String)
            }
        }
        return mutableDictionary
    }
}
