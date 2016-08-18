import React from 'react'

export default ComposedComponent => class extends React.Component {

  static displayName = 'ValidationFormComponent';

  static contextTypes = {
    form: React.PropTypes.object
  };

  componentWillMount() {
    if (!this.props.name) {
      throw new Error(`Validation for '${ComposedComponent.displayName || ''}' requires a name property`);
    }
    this.context.form.addField(this);
  }

  setValue = (value) => {
    return this.context.form.setFieldValue(this.props.name, value);
  }

  getValue = () => {
    return this.getState() && this.getState().value;
  }

  getError = () => {
    let errors = this.getState() ? this.getState().errors : [];
    return errors.length > 0 ? errors[0] : false;
  }

  isValid = () => {
    let errors = this.getState() ? this.getState().errors : [];
    return errors.length == 0;
  }

  isPristine = () => {
    return this.getState() ? this.getState().isPristine : true;
  }

  isRequired = () => {
    return this.getState.isRequired;
  }

  isFormDisabled = () => {
    //TODO: DEV ONLY, implement functionality
    return false;
  }

  getState() {
    return this.context.form.getField(this.props.name);
  }

  render() {
    return <ComposedComponent
      setValue={this.setValue}
      getValue={this.getValue}
      getError={this.getError}
      isRequired={this.isRequired}
      isValid={this.isValid}
      isPristine={this.isPristine}
      isFormDisabled={this.isFormDisabled}
      {...this.props}
    />
  }
}