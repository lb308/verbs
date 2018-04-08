import SelectDropdown from 'lb308/components/SelectDropdown';
import Button from 'lb308/components/Button';
import saveSettings from 'lb308/utils/saveSettings';

export default class SettingDropdown extends SelectDropdown {
  static initProps(props) {
    super.initProps(props);

    props.className = 'SettingDropdown';
    props.buttonClassName = 'Button Button--text';
    props.caretIcon = 'caret-down';
    props.defaultLabel = 'Custom';

    props.children = props.options.map(({value, label}) => {
      const active = app.data.settings[props.key] === value;

      return Button.component({
        children: label,
        icon: active ? 'check' : true,
        onclick: saveSettings.bind(this, {[props.key]: value}),
        active
      });
    });
  }
}
