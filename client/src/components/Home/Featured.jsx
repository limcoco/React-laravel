import React from "react";
import Container from "@material-ui/core/Container";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
// import Divider from "@material-ui/core/Divider";
import thumbnail2 from "../../images/thumbnail2.png";
import { Link } from "react-router-dom";
import { database } from "../../Helper/Firebase";
import { getUserName } from "../../Helper/user";
import { startLoading, stopLoading, updateVideos } from "../../store/action";
import { connect } from "react-redux";
import { Modal } from "antd";
import {
  removeVideoFromEverywhere,
  removeVideoFromFeature,
  disableVideo
} from "../../Helper/videos";
import { success, errorMessage } from "../../Helper/Message";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  item: {
    maxWidth: 360,
    margin: 15
  },
  image: {
    height: 200,
    width: "100%",
    borderRadius: 5
  }
});

class Featured extends React.Component {
  // Setting featured videos IDs in this state array
  state = {
    featuredVideos: []
  };
  componentWillMount() {
    this.props.startLoading();
  }
  // Updating the UI when deletion happen
  removeVideoState = _ => {
    this.props.updateVideos();
  };
  showConfirmRemove(videoObj) {
    const componentThis = this;
    const confirm = Modal.confirm;
    confirm({
      title: "Do you Want To Remove This Video?",
      onOk() {
        componentThis.props.startLoading();
        removeVideoFromEverywhere(videoObj)
          .then(() => {
            componentThis.props.stopLoading();
            componentThis.removeVideoState(videoObj.videoId);
            componentThis.props.updateVideos();
            return success("Video Removed Successfully");
          })
          .catch(err => {
            errorMessage(err.message);
            console.log(err);
          });
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  }
  showConfirmHide(videoId) {
    const componentThis = this;
    const confirm = Modal.confirm;
    confirm({
      title: "Do you Want To Hide This Video?",
      onOk() {
        componentThis.props.startLoading();
        removeVideoFromFeature(videoId).then(() => {
          componentThis.removeVideoState(videoId);
          componentThis.props.stopLoading();
          success("Video Hide Successfully");
        });
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  }

  showConfirmDisable(videoId) {
    const componentThis = this;
    const confirm = Modal.confirm;
    confirm({
      title: "Do you Want To Disable This Video?",
      onOk() {
        componentThis.props.startLoading();
        disableVideo(videoId)
          .then(() => {
            componentThis.removeVideoState(videoId);
            componentThis.props.stopLoading();
            success("Video Disabled Successfully");
          })
          .catch(err => {
            console.log(err);
          });
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  }
  componentDidMount() {
    const componentThis = this;
    // Getting All featured videos from the firebase database
    database
      .ref("admin/featured/")
      .once("value")
      .then(value => {
        this.props.stopLoading();
        let featuredVideos = [];
        value.forEach(videoId => {
          featuredVideos.push(videoId.val());
        });
        componentThis.setState(prevState => {
          return {
            featuredVideos
          };
        });
      });
  }
  render() {
    const { classes } = this.props;
    return (
      <Container>
        <Typography
          style={{
            marginTop: 10,
            marginBottom: 20,
            color: "#00AEEF",
            fontWeight: "bold",
            fontSize: 18,
            margin: 10
          }}
        >
          Featured films
        </Typography>
        <div
          id="featured_div_main"
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "start"
          }}
        >
          {this.state.featuredVideos.length !== 0
            ? this.props.videos.map((videoObj, value) => {
                if (
                  this.state.featuredVideos.indexOf(videoObj.videoId) !== -1
                ) {
                  return (
                    <div key={value} style={{ margin: 10, width: 350 }}>
                      <Link
                        to={{
                          pathname: `/play/${videoObj.videoId}`,
                          videoObj: `${JSON.stringify(videoObj)}`,
                          state: { fromDashboard: true }
                        }}
                      >
                        {console.log(videoObj)}
                        <img
                          src={videoObj.poster}
                          className={classes.image}
                          alt="thumbnail"
                        />
                        <div>
                          <Grid container>
                            <Grid
                              item
                              xs={12}
                              style={{ textAlign: "left", marginTop: 8 }}
                            >
                              <Typography
                                style={{
                                  fontSize: 16,
                                  fontWeight: "bold",
                                  color: "#00AEEF"
                                }}
                              >
                                {videoObj.title}
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={6}
                              style={{
                                textAlign: "left",
                                marginTop: 5,
                                marginBottom: 10
                              }}
                            >
                              <Typography style={{ color: "grey" }}>
                                Functionality Pending
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={6}
                              style={{
                                textAlign: "right",
                                marginTop: 5,
                                marginBottom: 10
                              }}
                            >
                              <Typography>126k plays</Typography>
                            </Grid>
                          </Grid>
                        </div>
                      </Link>
                    </div>
                  );
                }
                return null;
              })
            : "No Video"}
        </div>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    videos: state.videos,
    admin: state.admin,
    loading: state.loading
  };
};

const mapDispatchToProps = dispatch => ({
  startLoading: () => dispatch(startLoading()),
  stopLoading: () => dispatch(stopLoading()),
  updateVideos: () => dispatch(updateVideos())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Featured));
