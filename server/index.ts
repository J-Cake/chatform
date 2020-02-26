import * as express from 'express';
import * as SourceMaps from 'source-map-support';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as morgan from 'morgan';

import routes from './routes/routes';
import API from './routes/api';

SourceMaps.install();

const app: express.Express = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

app.use(routes);
app.use('/api', API);

const port: number = Number(process.argv[2]) || Number(process.env.PORT) || 9052;

app.listen(port, function () {
    console.log(`Listening on ${port}`);
});
