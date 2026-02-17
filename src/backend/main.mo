import Time "mo:core/Time";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";

actor {
  type Message = {
    messageId : Nat;
    timestamp : Time.Time;
    content : Text;
  };

  module Message {
    public func compareByTimestamp(msg1 : Message, msg2 : Message) : { #less; #equal; #greater } {
      if (msg1.timestamp < msg2.timestamp) { return #less };
      if (msg1.timestamp > msg2.timestamp) { return #greater };
      #equal;
    };
  };

  var storedPassword = "icp";
  var nextMessageId = 0;
  let messages = Map.empty<Nat, Message>();

  public shared ({ caller }) func setPassword(oldPassword : Text, newPassword : Text) : async () {
    switch (Text.equal(oldPassword, storedPassword)) {
      case (false) { Runtime.trap("Incorrect current password!") };
      case (true) {
        storedPassword := newPassword;
      };
    };
  };

  public shared ({ caller }) func addMessage(password : Text, content : Text) : async Message {
    switch (Text.equal(password, storedPassword)) {
      case (false) { Runtime.trap("Incorrect password!") };
      case (true) {
        let message : Message = {
          messageId = nextMessageId;
          timestamp = Time.now();
          content;
        };
        messages.add(nextMessageId, message);
        nextMessageId += 1;
        message;
      };
    };
  };

  public query ({ caller }) func getMessages(password : Text, sinceMessageId : ?Nat) : async [Message] {
    if (not Text.equal(password, storedPassword)) { Runtime.trap("Incorrect password!") };
    let messagesArray = messages.values().toArray();
    switch (sinceMessageId) {
      case (null) { return messagesArray.sort(Message.compareByTimestamp) };
      case (?sinceId) {
        let filteredMessages = messagesArray.filter(
          func(msg) { msg.messageId > sinceId }
        );
        return filteredMessages.sort(Message.compareByTimestamp);
      };
    };
  };

  public shared ({ caller }) func clearChat(password : Text) : async () {
    if (not Text.equal(password, storedPassword)) { Runtime.trap("Incorrect password!") };
    messages.clear();
    nextMessageId := 0;
  };
};
