import ForumApp from 'lb308/ForumApp';
import store from 'lb308/initializers/store';
import preload from 'lb308/initializers/preload';
import routes from 'lb308/initializers/routes';
import components from 'lb308/initializers/components';
import humanTime from 'lb308/initializers/humanTime';
import boot from 'lb308/initializers/boot';
import alertEmailConfirmation from 'lb308/initializers/alertEmailConfirmation';

const app = new ForumApp();

app.initializers.add('store', store);
app.initializers.add('routes', routes);
app.initializers.add('components', components);
app.initializers.add('humanTime', humanTime);

app.initializers.add('preload', preload, -100);
app.initializers.add('boot', boot, -100);
app.initializers.add('alertEmailConfirmation', alertEmailConfirmation, -100);

export default app;
