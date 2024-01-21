export interface ErrorMessages {
  /* -- Auth -- */
  userNotFound: string;
  emailTaken: string;
  usernameTaken: string;
  otpForVerification: string;
  accountVerified: string;
  invalidOtp: string;
  verificationSuccessful: string;
  verificationFailed: string;
  loginSuccessfully: string;
  resendAfter60Seconds: string;
  invalidUsernameOrPassword: string;
  passwordMismatch: string;
  requestSuccessful: string;
  requestFailed: string;
  /* -- User Activities -- */
  userActivityNotFound: string;
  userActivityCreatedSuccessfully: string;
  userActivityDeletedSuccessfully: string;
  failedToCreateUserActivity: string;
  failedToDeleteUserActivity: string;
  /* -- User -- */
  /* -- Profile -- */
  profileNotFound: string;
  profileCreatedSuccessfully: string;
  profileUpdatedSuccessfully: string;
  failedToCreateProfile: string;
  failedToUpdateProfile: string;
  /* -- Address -- */
  addressNotFound: string;
  addressExist: string;
  addressCreatedSuccessfully: string;
  addressUpdatedSuccessfully: string;
  failedToCreateAddress: string;
  failedToUpdateAddress: string;
  /* -- About -- */
  aboutNotFound: string;
  aboutExist: string;
  aboutCreatedSuccessfully: string;
  aboutUpdatedSuccessfully: string;
  failedToCreateAbout: string;
  failedToUpdateAbout: string;
  /* -- Phone -- */
  phoneNotFound: string;
  phoneExist: string;
  phoneCreatedSuccessfully: string;
  phoneDeletedSuccessfully: string;
  failedToDeletePhone: string;
  phoneMaxLength: string;
  phoneVerified: string;
  /* -- Date -- */
  dateNotFound: string;
  dateCreatedSuccessfully: string;
  failedToCreateDate: string;
  dateUpdatedSuccessfully: string;
  failedToUpdateDate: string;
  /* -- Education -- */
  educationNotFound: string;
  educationCreatedSuccessfully: string;
  educationUpdatedSuccessfully: string;
  educationDeletedSuccessfully: string;
  failedToCreateEducation: string;
  failedToUpdateEducation: string;
  failedToDeleteEducation: string;
  /* -- Job -- */
  jobNotFound: string;
  jobCreatedSuccessfully: string;
  failedToCreateJob: string;
  jobUpdatedSuccessfully: string;
  failedToUpdateJob: string;
  jobDeletedSuccessfully: string;
  failedToDeleteJob: string;
  /* -- Profile Picture -- */
  profilePictureNotFound: string;
  profilePictureCreatedSuccessfully: string;
  profilePictureDeletedSuccessfully: string;
  failedToCreateProfilePicture: string;
  failedToDeleteProfilePicture: string;
  /* -- Cover Picture -- */
  coverPictureNotFound: string;
  coverPictureCreatedSuccessfully: string;
  coverPictureDeletedSuccessfully: string;
  failedToCreateCoverPicture: string;
  failedToDeleteCoverPicture: string;
  /* -- Friend Request -- */
  noFriendRequestsFound: string;
  friendRequestNotFound: string;
  friendRequestSent: string;
  friendAlreadyRequested: string;
  friendRequestAcceptedSuccessfully: string;
  friendRequestUpdatedSuccessfully: string;
  friendRequestAlreadyUpdated: string;
  failedToSendFriendRequest: string;
  cannotSendRequestToYourself: string;
  /* -- Friend -- */
  noFriendsFound: string;
  friendNotFound: string;
  friendExist: string;
  friendDeletedSuccessfully: string;
  failedToDeleteFriend: string;
  /* -- Relationship Request -- */
  relationshipRequestNotFound: string;
  noRelationshipRequestsFound: string;
  relationshipRequestSent: string;
  relationshipRequestAcceptedSuccessfully: string;
  relationshipRequestUpdatedSuccessfully: string;
  cannotSendRelationRequestToYourself: string;
  relationshipAlreadyRequested: string;
  relationshipRequestAlreadyUpdated: string;
  failedToSendRelationshipRequest: string;
  /* -- Relationship -- */
  relationshipNotFound: string;
  noRelationshipsFound: string;
  relationshipCreatedSuccessfully: string;
  relationshipDeletedSuccessfully: string;
  relationshipUpdatedSuccessfully: string;
  failedToUpdateRelationship: string;
  failedToDeleteRelationship: string;
  /* -- Visit -- */
  cannotVisitYourself: string;
  visitCreatedSuccessfully: string;
  failedToCreateVisit: string;
  visitUpdatedSuccessfully: string;
  failedToUpdateVisit: string;
  /* -- Group -- */
  groupNotFound: string;
  groupCreatedSuccessfully: string;
  groupUpdatedSuccessfully: string;
  groupDeletedSuccessfully: string;
  failedToCreateGroup: string;
  failedToUpdateGroup: string;
  failedToDeleteGroup: string;
  /* -- Group Request -- */
  noGroupRequestsFound: string;
  groupRequestNotFound: string;
  groupRequestSentSuccessfully: string;
  groupRequestUpdatedSuccessfully: string;
  groupRequestAlreadySent: string;
  groupRequestAlreadyUpdated: string;
  memberAlreadyExistInGroup: string;
  failedToSendGroupRequest: string;
  failedToUpdateGroupRequest: string;
  notAuthorized: string;
  /* -- Group Member -- */
  groupMemberNotFound: string;
  groupMemberCreatedSuccessfully: string;
  groupMemberUpdatedSuccessfully: string;
  groupMemberDeletedSuccessfully: string;
  failedToCreateGroupMember: string;
  failedToUpdateGroupMember: string;
  failedToDeleteGroupMember: string;
  /* -- Page -- */
  pageNotFound: string;
  pageCreatedSuccessfully: string;
  pageUpdatedSuccessfully: string;
  pageDeletedSuccessfully: string;
  failedToCreatePage: string;
  failedToUpdatePage: string;
  failedToDeletePage: string;
  /* -- Page Admins -- */
  pageAdminNotFound: string;
  pageAdminCreatedSuccessfully: string;
  pageAdminUpdatedSuccessfully: string;
  pageAdminDeletedSuccessfully: string;
  failedToCreatePageAdmin: string;
  failedToUpdatePageAdmin: string;
  failedToDeletePageAdmin: string;
  pageAdminExist: string;
  /* -- Page Followers -- */
  pageFollowingCreatedSuccessfully: string;
  pageUnFollowingSuccessfully: string;
  pageFollowerUpdatedSuccessfully: string;
  failedToFollowingPage: string;
  failedToUnFollowPage: string;
  failedToUpdatePageFollower: string;
  alreadyFollowingPage: string;
  notFollowingPage: string;
  /* -- Post -- */
  postNotFound: string;
  postCreatedSuccessfully: string;
  postUpdatedSuccessfully: string;
  postDeletedSuccessfully: string;
  failedToCreatePost: string;
  failedToUpdatePost: string;
  failedToDeletePost: string;
  /* -- Post Likes -- */
  postLikedSuccessfully: string;
  postUnLikedSuccessfully: string;
  failedToLikePost: string;
  failedToUnLikePost: string;
  postAlreadyLiked: string;
  postAlreadyUnLiked: string;
  /* -- Post Comments -- */
  postCommentNotFound: string;
  postCommentCreatedSuccessfully: string;
  postCommentUpdatedSuccessfully: string;
  postCommentDeletedSuccessfully: string;
  failedToCreatePostComment: string;
  failedToUpdatePostComment: string;
  failedToDeletePostComment: string;
  /* -- Comment Likes -- */
  commentLikedSuccessfully: string;
  commentUnLikedSuccessfully: string;
  failedToLikeComment: string;
  failedToUnLikeComment: string;
  commentAlreadyLiked: string;
  commentAlreadyUnLiked: string;
  /* -- Comment Replies -- */
  commentReplyNotFound: string;
  commentReplyCreatedSuccessfully: string;
  commentReplyUpdatedSuccessfully: string;
  commentReplyDeletedSuccessfully: string;
  failedToCreateCommentReply: string;
  failedToUpdateCommentReply: string;
  failedToDeleteCommentReply: string;
  /* -- Reply Likes -- */
  replyLikedSuccessfully: string;
  replyUnLikedSuccessfully: string;
  failedToLikeReply: string;
  failedToUnLikeReply: string;
  replyAlreadyLiked: string;
  replyAlreadyUnLiked: string;
  /* -- Chats -- */
  chatNotFound: string;
  chatCreatedSuccessfully: string;
  chatUpdatedSuccessfully: string;
  chatDeletedSuccessfully: string;
  failedToCreateChat: string;
  failedToUpdateChat: string;
  failedToDeleteChat: string;
  chatAlreadyExist: string;
  /* -- Group Chat -- */
  groupChatNotFound: string;
  groupChatCreatedSuccessfully: string;
  groupChatUpdatedSuccessfully: string;
  groupChatDeletedSuccessfully: string;
  failedToCreateGroupChat: string;
  failedToUpdateGroupChat: string;
  failedToDeleteGroupChat: string;
  /* -- Group Chat Members -- */
  groupChatMemberNotFound: string;
  groupChatMemberCreatedSuccessfully: string;
  groupChatMemberUpdatedSuccessfully: string;
  groupChatMemberDeletedSuccessfully: string;
  failedToCreateGroupChatMember: string;
  failedToUpdateGroupChatMember: string;
  failedToDeleteGroupChatMember: string;
  groupChatMemberAlreadyExist: string;
  /* -- Archived Chats -- */
  chatArchivedNotFound: string;
  chatArchivedSuccessfully: string;
  chatUnArchivedSuccessfully: string;
  failedToArchiveChat: string;
  failedToUnArchiveChat: string;
  chatAlreadyArchived: string;
  chatAlreadyUnArchived: string;
  /* -- Conversation -- */
  conversationNotFound: string;
  conversationCreatedSuccessfully: string;
  conversationDeletedSuccessfully: string;
  failedToCreateConversation: string;
  failedToDeleteConversation: string;
  /* -- Messages -- */
  messageNotFound: string;
  messageCreatedSuccessfully: string;
  messageUpdatedSuccessfully: string;
  messageDeletedSuccessfully: string;
  failedToCreateMessage: string;
  failedToUpdateMessage: string;
  failedToDeleteMessage: string;
  /* -- Message Reactions -- */
  messageReactedSuccessfully: string;
  messageUnReactSuccessfully: string;
  messageAlreadyReacted: string;
  /* -- Settings -- */
  settingsNotFound: string;
  settingsCreatedSuccessfully: string;
  settingsUpdatedSuccessfully: string;
  failedToCreateSettings: string;
  failedToUpdateSettings: string;
}
