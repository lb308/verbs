import Modal from 'lb308/components/Modal';

export default class LoadingModal extends Modal {
  isDismissible() {
    return false;
  }

  className() {
    return 'LoadingModal Modal--small';
  }

  title() {
    return app.translator.trans('core.admin.loading.title');
  }

  content() {
    return '';
  }
}
