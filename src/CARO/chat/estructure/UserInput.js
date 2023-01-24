import React from "react";
import SendIcon from '@mui/icons-material/Send';
class UserInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      activity: props.activity,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      message: e.target.value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    var response = {
      activity: this.state.activity,
      msg: this.state.message,
      responses: [],
      sender: "U",
    };
    this.props.sendMessage(response);
    this.setState({
      message: "",
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="msger-inputarea">
        <div className="chat-input">
          <input
            onChange={this.handleChange}
            value={this.state.message}
            placeholder="Escribe un mensaje..."
            type="text"
          />
          <button type="submit" className="send-btn">
            <SendIcon/>
          </button>
        </div>
      </form>
    );
  }
}

export default UserInput;
