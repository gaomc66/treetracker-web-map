import React from "react";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  "@keyframes spin": {
    from: {
      transform: "rotate(0deg)",
    },
    to: {
      transform: "rotate(360deg)",
    },
  },
  loader: {
    border: "12px solid #f3f3f3",
    borderTop: "12px solid #ff9800",
    borderRadius: "50%",
    width: 60,
    height: 60,
    animation: "$spin 1.5s linear infinite",
    [theme.breakpoints.down("md")]: {
      border: "8px solid #f3f3f3",
      borderTop: "8px solid #ff9800",
      width: 40,
      height: 40,
    },
  },
}));

export default function(){
  const classes = useStyles();
  return (
    <div className={classes.loader} ></div>
  );
}
