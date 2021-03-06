import React, { Component } from "react";
import { Link } from "react-router-dom";
import Comments from "../Comments/Comments";
import { success, errorMessage } from "../../Helper/Message";
import { connect } from "react-redux";
import { database } from "../../Helper/Firebase";
import uuid from "uuid";
import { getAllUsers } from "../../Helper/user";
import { getSingleVideo } from "../../Helper/videos";
import Grid from "@material-ui/core/Grid";

class VideoPlay extends Component {
  state = {
    videoObj: {},
    userObj: {},
    liked: false
  };
  componentDidMount() {
    const componentThis = this;
    if (this.props.location.videoObj) {
      console.log("videoObj");
      let videoObj = JSON.parse(this.props.location.videoObj);
      getAllUsers().then(users => {
        users.map(user => {
          if (user.userId === videoObj.userId) {
            componentThis.setState({
              userObj: user
            });
          }
          return users;
        });
      });
      videoObj = {
        ...videoObj,
        likes: JSON.parse(videoObj.likes),
        comments: JSON.parse(videoObj.comments)
      };
      componentThis.setState({
        videoObj
      });
      console.log(videoObj);
    } else {
      let videoId = window.location.pathname.split("/")[2];
      getSingleVideo(videoId).then(videoObj => {
        let videoObjUpdated = {
          ...videoObj,
          likes: JSON.parse(videoObj.likes),
          comments: JSON.parse(videoObj.comments)
        };
        getAllUsers().then(users => {
          users.map(user => {
            if (user.userId === videoObj.userId) {
              componentThis.setState({
                userObj: user
              });
            }
            return users;
          });
        });
        componentThis.setState({
          videoObj: videoObjUpdated
        });
      });
    }
  }
  updateLikes = updatedLikes => {
    database
      .ref(`videos/${this.state.videoObj.videoId}`)
      .update({
        likes: JSON.stringify(updatedLikes)
      })
      .then(() => {
        success("You Have Liked The Video");
        this.setState(prevState => {
          return {
            videoObj: {
              ...prevState.videoObj,
              likes: updatedLikes
            }
          };
        });
        localStorage.setItem("videoObj", JSON.stringify(this.state.videoObj));
      })
      .catch(err => {
        errorMessage(err.message);
      });
  };
  likeVideo = _ => {
    let likeId = uuid();
    let updatedLikes = this.state.videoObj.likes.concat([`${likeId}`]);
    this.setState(prevState => ({
      ...prevState,
      liked: true
    }));
    return this.updateLikes(updatedLikes);
  };
  render() {
    return (
      <div id="mainContainer">
        <Grid container>
          <Grid xs={1} />
          <Grid xs={10}>
            <Grid container>
              <Grid xs={12} md={8} id="leftContainer">
                <div>
                  <p className="fontFam" id="videoTitle">
                    {this.state.videoObj.title}
                  </p>
                </div>
                <div id="vidContainer">
                  <video
                    src={this.state.videoObj.path}
                    width="100%"
                    height="100%"
                    controls
                    controlsList="nodownload"
                    poster={this.state.videoObj.poster}
                  />
                </div>
                <div id="btnContainer" className="fluidDiv">
                  <button id="likeBtn">
                    <span id="likeTxt">LIKE</span>
                    <img
                      id="likeIcon"
                      src={require("../../assets/VideoPlay/icons/thumb.png")}
                      alt=""
                    />
                  </button>
                  <div className="iconsContainer">
                    <img
                      id="likesIcon"
                      src={require("../../assets/VideoPlay/icons/hearts.png")}
                      alt=""
                    />
                    <span className="btnCntText">12,6k</span>
                  </div>
                  <div className="iconsContainer">
                    <img
                      id="playsIcon"
                      src={require("../../assets/VideoPlay/icons/plays.png")}
                      alt=""
                    />
                    <span className="btnCntText">1563</span>
                  </div>
                  <div className="iconsContainer">
                    <img
                      id="commentsIcon"
                      src={require("../../assets/VideoPlay/icons/comments.png")}
                      alt=""
                    />
                    <span className="btnCntText">26</span>
                  </div>
                  <button id="shareBtn">
                    <span id="shareTxt">SHARE</span>
                    <img
                      id="shareIcon"
                      src={require("../../assets/VideoPlay/icons/share.png")}
                      alt=""
                    />
                  </button>
                </div>
                <div id="dscrContainer">
                  <div id="namedpContainer">
                    <div className="dpContainer">
                      <img
                        className="dp"
                        src={require("../../assets/VideoPlay/images/dp.png")}
                        alt=""
                      />
                    </div>
                    <Link
                      to={{
                        pathname: `/user/info/${this.state.userObj.userId}`,
                        userObj: `${JSON.stringify(this.state.userObj)}`,
                        state: { fromDashboard: true }
                      }}
                    >
                      <span id="uploaderName">{this.state.userObj.name}</span>
                    </Link>
                  </div>
                  <div id="uploaderDescCntnr">
                    <span>{this.state.userObj.userDescription}</span>
                  </div>
                  <div id="catInfo">
                    <div id="catInfoDiv">
                      <p className="catInfoTxt">{this.state.videoObj.genere}</p>
                    </div>
                  </div>
                </div>
                {this.props.auth && !this.props.user.lock ? (
                  <Comments
                    videoId={this.state.videoObj.videoId}
                    comments={
                      this.state.videoObj.comments !== undefined
                        ? this.state.videoObj.comments
                        : []
                    }
                  />
                ) : null}
              </Grid>
              <Grid xs={0} md={1} />
              <Grid xs={12} md={3} id="rightContainer">
                <div>
                  <p className="fontFam" id="recTitle">
                    RECOMMENDED
                  </p>
                </div>
                <div className="recVidContainer">
                  <img
                    style={{ borderRadius: 5 }}
                    src={require("../../assets/VideoPlay/images/rec1.png")}
                    alt=""
                  />
                  <span className="recVidTitle fontFam">New York vs Tokyo</span>
                  <span className="recVidAuthor fontFam">
                    Steven Allan Spielberg
                  </span>
                  <sapn className="recVidAuthor fontFam views">
                    12,6k plays
                  </sapn>
                </div>
                <div className="recVidContainer">
                  <img
                    style={{ borderRadius: 5 }}
                    src={require("../../assets/VideoPlay/images/rec2.png")}
                    alt=""
                  />
                  <span className="recVidTitle fontFam">
                    Mouses around the world
                  </span>
                  <span className="recVidAuthor fontFam">
                    Steven Allan Spielberg
                  </span>
                  <sapn className="recVidAuthor fontFam views">
                    12,6k plays
                  </sapn>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid xs={1} />
        </Grid>
      </div>
      // <div classNameName="videoPlayerMain mainDiv">
      //   {/* You can use your custome video link here */}
      //   <h1> Video Player</h1>
      //   <div classNameName="playerDivMain">
      //     <div id="videoDiv">
      //       <video
      //         src={this.state.videoObj.path}
      //         width="100%"
      //         height="100%"
      //         controls
      //         controlsList="nodownload"
      //         poster={this.state.videoObj.poster}
      //       />
      //     </div>
      //     <div id="videoDescriptionDiv">
      //       <h1>{this.state.videoObj.title}</h1>
      //       <p>{this.state.videoObj.description}</p>
      //       <button
      //         classNameName="btn"
      //         onClick={this.likeVideo}
      //         disabled={this.state.liked ? true : false}
      //       >
      //         Like
      //       </button>
      //       <span id="heartVideo">
      //         <span id="heartVideoIcon">
      //           <i classNameName="fa fa-heart" />{" "}
      //         </span>
      //         <span id="likesCount">
      //           {this.state.videoObj.likes !== undefined
      //             ? this.state.videoObj.likes.length
      //             : 0}
      //         </span>
      //       </span>
      //       <div id="mainUserInfo">
      //         <span id="videoPlayPostedByHeading">User: </span>
      //         <Link
      //           to={{
      //             pathname: `/user/info/${this.state.userObj.userId}`,
      //             userObj: `${JSON.stringify(this.state.userObj)}`,
      //             state: { fromDashboard: true }
      //           }}
      //         >
      //           <span>{this.state.userObj.name}</span>
      //         </Link>
      //       </div>
      //       <div>
      //         {this.state.videoObj.series ? (
      //           <div id="seriesLink">
      //             <Link
      //               to={{
      //                 pathname: `/series/videos/${
      //                   this.state.videoObj.seriesId
      //                 }/${this.state.userObj.userId}`,
      //                 seriesId: this.state.videoObj.seriesId,
      //                 userId: this.state.userObj.userId,
      //                 state: { fromDashboard: true }
      //               }}
      //             >
      //               <span>Click To See All Series Videos</span>
      //             </Link>
      //           </div>
      //         ) : null}
      //       </div>
      //     </div>
      //   </div>
      //   {this.props.auth && !this.props.user.lock ? (
      //     <Comments
      //       videoId={this.state.videoObj.videoId}
      //       comments={
      //         this.state.videoObj.comments !== undefined
      //           ? this.state.videoObj.comments
      //           : []
      //       }
      //     />
      //   ) : null}
      // </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.currentUser,
    auth: state.auth
  };
};

export default connect(mapStateToProps)(VideoPlay);
