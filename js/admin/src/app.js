import App from 'lb308/App';
import store from 'lb308/initializers/store';
import preload from 'lb308/initializers/preload';
import routes from 'lb308/initializers/routes';
import boot from 'lb308/initializers/boot';

const app = new App();

app.initializers.add('store', store);
app.initializers.add('routes', routes);

app.initializers.add('preload', preload, -100);
app.initializers.add('boot', boot, -100);

app.extensionSettings = {};

app.getRequiredPermissions = function(permission) {
  const required = [];

  if (permission === 'startDiscussion' || permission.indexOf('verb.') === 0) {
    required.push('viewDiscussions');
  }
  if (permission === 'verb.delete') {
    required.push('verb.hide');
  }
  if (permission === 'verb.deletePosts') {
    required.push('verb.editPosts');
  }

  return required;
};

export default app;
