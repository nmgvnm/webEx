"use strict";

/*!
 *
 * RemoteMeeting - WebRTC signaling.js
 *
 * IMPORTANT NOTE: This file is licensed only for use in providing the RSUPPORT services,
 *
 * @license Copyright (c) RSUPPORT CO., LTD. (http://www.rsupport.com/)
 * @author Front-End Team | Park Jeong Shik (jspark@rsupport.com)
 * @fileOverview WebRTC Signaling to advanced media server (sending만 담당, onmessage는 main.js에서 컨트롤함)
 *
 */
function Signaling(data) {
  console.log('Loaded Signaling', arguments);
  var send = data.socket.publish;
  var appType = data.appType;
  var apiServer = data.apiServer;
  var advancedMediaDomain = data.advancedMediaDomain;
  var controlServer = data.controlServer;
  var mediaServer = data.mediaServer;
  var conferenceID = data.conferenceID;
  var endpointID = data.endpointID;
  var userID = data.userID; // AMS 서버 구분용 버전

  var browser = {
    name: DetectRTC.browser.name.toLowerCase(),
    version: DetectRTC.browser.fullVersion
  };
  /**
   * sendMediaChannelCreation
   * @param ownerID
   */

  this.sendMediaChannelCreation = function (ownerID) {
    send("/RCCP/Media/".concat(advancedMediaDomain), {
      mediaChannelCreateRequest: {
        appType: appType,
        apiServer: apiServer,
        controlServer: controlServer,
        mediaServer: mediaServer,
        conferenceID: conferenceID,
        ownerID: ownerID,
        browser: browser
      }
    });
  };
  /**
   * sendMediaConnection
   * @param type
   */


  this.sendMediaConnection = function (type) {
    send("/RCCP/Media/".concat(advancedMediaDomain, "/").concat(conferenceID), {
      mediaConnectionRequest: {
        sessionType: type,
        conferenceID: conferenceID,
        endpointID: endpointID,
        userID: userID,
        browser: browser
      }
    });
  };
  /**
   * sendMediaDisconnection
   * @param type
   */


  this.sendMediaDisconnection = function (type) {
    send("/RCCP/Media/".concat(advancedMediaDomain, "/").concat(conferenceID), {
      sessionTerminateRequest: {
        sessionType: type,
        endpointID: endpointID
      }
    });
  };
  /**
   * sendSessionOffer
   * Offer를 먼저 보내는일은 P2P 상황에서 사용된다.
   *
   * @param targetID
   * @param type
   * @param sdp
   */


  this.sendSessionOffer = function (targetID, type, sdp) {
    var topic = "/RCCP/CON/".concat(conferenceID, "/").concat(targetID);
    send(topic, {
      sessionOffer: {
        sessionType: type,
        endpointID: endpointID,
        SDP: sdp
      }
    });
  };
  /**
   * sendSessionAnswer
   * @param targetID
   * @param type
   * @param sdp
   */


  this.sendSessionAnswer = function (targetID, type, sdp) {
    var topic = "/RCCP/Media/".concat(advancedMediaDomain, "/").concat(conferenceID);

    if (targetID) {
      topic = "/RCCP/CON/".concat(conferenceID, "/").concat(targetID);
    }

    send(topic, {
      sessionAnswer: {
        sessionType: type,
        endpointID: endpointID,
        SDP: sdp
      }
    });
  };
  /**
   * sendCandidate
   * @param targetID
   * @param type
   * @param cadidateInfo
   */


  this.sendCandidate = function (targetID, type, cadidateInfo) {
    var topic = "/RCCP/Media/".concat(advancedMediaDomain, "/").concat(conferenceID);

    if (targetID) {
      topic = "/RCCP/CON/".concat(conferenceID, "/").concat(targetID);
    }

    send(topic, {
      candidateInfo: {
        sessionType: type,
        endpointID: endpointID,
        sdpMLineIndex: cadidateInfo.sdpMLineIndex,
        sdpMid: cadidateInfo.sdpMid,
        candidate: cadidateInfo.candidate
      }
    });
  };
  /**
   * sendMediaPin
   * @param targetID
   * @param isPipOn
   */


  this.sendMediaPin = function (targetID, isPipOn) {
    send("/RCCP/Media/".concat(advancedMediaDomain, "/").concat(conferenceID), {
      pinRequest: {
        endpointID: endpointID,
        targetEndpointID: targetID,
        isOn: isPipOn
      }
    });
  };
  /**
   * sendMessageToAmsServer
   * @param data
   */


  this.sendMessageToAmsServer = function (data) {
    send("/RCCP/Media/".concat(advancedMediaDomain, "/").concat(conferenceID), data);
  };
} // inherit(EventEmitter, Signaling);