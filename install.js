#!/usr/bin/casperjs test

var config = {
	mysql_username: 'dbval',
	mysql_password: 'dbval',
	mysql_database: 'dbval',
	mysql_hostname: 'localhost',
	blog_baseurl: 'http://urlval',
	blog_title: 'ThemeFuse Shopping',
	blog_username: 'admin',
	blog_password: 'admin',
	blog_email: 'example@example.com',
	blog_seo_index: true
};

var x = require('casper').selectXPath;
var test = casper.test;

casper.options.verbose = true;
casper.options.logLevel = 'debug';

casper.on('step.error', function(err) {
    this.die("Step has failed: " + err + '\n\n' + this.page.content);
});

casper.start(config.blog_baseurl + '/', function () {
	var a = x('//a[contains(text(), "Create a Configuration File")]');
	test.assertTextExists('There doesn\'t seem to be a wp-config.php file. I need this before we can get started.');
	test.assertExists(a);
	this.click(a);
});

casper.then(function () {
	var a = x('//a[contains(text(), "Let’s go!")]');
	test.assertTextExists('Welcome to WordPress. Before getting started, we need some information on the database. You will need to know the following items before proceeding.');
	test.assertExists(a);
	this.click(a);
});

casper.then(function () {
	var form = x('//form[descendant::input[@name="dbname"] and descendant::input[@name="uname"] and descendant::input[@name="pwd"] and descendant::input[@name="dbhost"] and descendant::input[@name="prefix"]]');
	test.assertTextExists('Below you should enter your database connection details. If you’re not sure about these, contact your host.');
	test.assertExists(form);
	this.fill(form, {
		dbname: config.mysql_database,
		uname: config.mysql_username,
		pwd: config.mysql_password,
		dbhost: config.mysql_hostname,
		prefix: 'wp_'
	}, true);
});

casper.then(function () {
	var a = x('//a[contains(text(), "Run the install")]');
	test.assertTextExists('All right, sparky! You’ve made it through this part of the installation.');
	test.assertExists(a);
	this.click(a);
});

casper.then(function () {
	var form = x('//form[descendant::input[@name="weblog_title"] and descendant::input[@name="user_name"] and descendant::input[@name="admin_password"] and descendant::input[@name="admin_password2"] and descendant::input[@name="admin_email"] and descendant::input[@name="blog_public"]]');
	test.assertTextExists('Welcome to the famous five minute WordPress installation process! You may want to browse the ReadMe documentation at your leisure. Otherwise, just fill in the information below and you’ll be on your way to using the most extendable and powerful personal publishing platform in the world.');
	this.fill(form, {
		weblog_title: config.blog_title,
		user_name: config.blog_username,
		admin_password: config.blog_password,
		admin_password2: config.blog_password,
		admin_email: config.blog_email,
		blog_public: config.seo_index
	}, true);
//	if (this.textExists('You appear to have already installed WordPress. To reinstall please clear your old database tables first.')) {
//	}
});

casper.then(function () {
	test.assertTextExists('WordPress has been installed. Were you expecting more steps? Sorry to disappoint.');
});

casper.run();
