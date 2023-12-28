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
  failedToCreateProfilePicture: string;
  profilePictureDeletedSuccessfully: string;
  failedToDeleteProfilePicture: string;
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
}
