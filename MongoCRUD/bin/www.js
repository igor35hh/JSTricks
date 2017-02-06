var app = require('../app');

app.set('port', process.env.PORT || 8000);

var server = app.listen(app.get('port'), () => {
	console.log('Express server listening om port '+server.address().port);
});