import React from 'react'

import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";

class SearchBar extends React.Component {
  render() {
    return (
        <Paper
          className="SearchBox"
          elevation={2}
        >
          <InputBase
            style={{ marginLeft: 8, flex: 1 }}
            placeholder="Search by films, users, serials"
          />
          <IconButton style={{ padding: 10 }} aria-label="Search">
            <SearchIcon />
          </IconButton>
        </Paper>

    )
  }
}


export default SearchBar
