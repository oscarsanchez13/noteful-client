import React from 'react'

class NotefulError extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {      
      return (
        <h2>Oh no! Something went wrong!</h2>
      );
    }
    return this.props.children;
    
  }  
}

export default NotefulError;