var Hapi = require('hapi'),
		_ = require('underscore'),
		findSuggestions = require('./src/findSynonyms.js');

var fs = require('fs');

var conf = JSON.parse

var owenResume = 'Education and Qualifications	2014-2015	2011-2012 2003-2008	Work Experience Nov-12 – Sep-14	Jan-10 – Jun-12	Jan-09 – Oct-12	Sep-06 – Dec-08	May-07 – Aug-07	Additional Information	Interests:	Achievements:	Nationality: Languages:	University of Oxford	Saïd Business School, UK	Penn State University	World Campus	University of New Brunswick	Fredericton, Canada	Development Gateway	Senior Associate	Masters in Business Administration, Alumni Annual Fund Scholarship GMAT 720 (94th Percentile)	Postbaccalaureate Certificate in Geographic Information Systems	B.Sc. Civil Engineering (First Division) Minor International Development	Washington (DC), USA	Owen SCOTT	e-mail: owen.scott@sbs.ox.ac.uk tel: +44(0)7778601364	￼￼• Managed six-figure technical assistance projects (2-4 person teams) in francophone and anglophone African countries, with accountability for all activities and budgets.	Independent Consultant Malawi / Lesotho / Ghana Software Developer and Project Manager	• Developed bespoke software for data management, and rolled it out through	contracts with two groups managing millions of dollars in infrastructure projects.	Engineers Without Borders Canada Malawi / Swaziland / Lesotho African Programs Staff	• Led a team to develop new data management software and processes for water	supply planning. Applied user-centered design principles to deliver a high-quality	product for users with low internet connectivity and limited computer skills.	• Successfully managed three program areas, with a team comprising of two full-	time staff members and 10 interns.	• Published two peer-reviewed papers on water supply monitoring approaches.	• Work was central to a successful $250,000 funding pitch to Google.org.	University of New Brunswick Fredericton, Canada Undergraduate Teaching Assistance	• Taught weekly classes on engineering design, technical communication, project	management, and effective teamwork for 30 first-year undergraduate engineering students.	Engineers Without Borders Canada Zambia Junior Fellow in International Development	• Supported a rural farming cooperative with business and engineering processes	for international crop export, resulting in new access to European markets	• Lived in a mud hut in a rural village, gaining immersive learning about the daily	realities of rural communities in Africa	GRE: Quantitative 168/170 (97th percentile), Verbal 170/170 (99th percentile). Received 7 scholarships/awards during undergraduate for leadership and academics.	Dual Canadian / American citizen	Strong French, Intermediate Chichewa (spoken by 14m people in southern Africa)	￼• Led re-engineering on two significant software product components, introducing our team to several new industry best-practices.	• Managed our relationship with the most important international standards body for international development data, making widely-recognized contributions.	￼￼Rugby (re-established the Lilongwe Rugby Football Club in 2011 and led the team	￼to its first tournament appearance in the modern era in 2012), Web Development	￼(self-taught to a professional level), Music (co-founded a band in 2011 and played	￼two international music festivals as well as many smaller venues through 2012)'
var ubuntuCapital = '￼￼Company Summary	Job Description – Technical Director	Ubuntu Capital is a for-profit social enterprise that seeks to expand the formal financial sector in developing countries by using a crowd-sourced, reputation-based alternative to a conventional credit score. By systematizing and formalizing relationship-based, word-of-mouth networks, Ubuntu will enable low-income, asset-poor individuals to convert positive social capital to financial capital. Ubuntu’s “Reputation Score” will provide lenders a quick and standardized metric by which to assess potential loan recipients, thereby linking reputable consumers and small business owners with banks, microlenders, and credit institutions, and others seeking to provide financing. And Ubuntu users can utilize the platform to search for service providers or market their own goods or services, similar to how Yelp and Angie’s List function within the United States. By enabling individuals to use their reputation as collateral, Ubuntu seeks to solve the information asymmetry between lenders and borrowers, drastically increasing access to financing in asset-poor communities.	Job Description	Ubuntu Capital is seeking a Technical Director to begin building its core product: a multi-sided feedback platform similar to Yelp® or Angie’s List®. Together with the CEO, the Technical Director will be responsible for recruiting and hiring a larger technical team as additional staff is required. This team will report directly to the Technical Director, who in turn reports to the CEO.	Key responsibilities include:	● Design and implement a scalable backend core proprietary platform	● Design and implement a mobile application (both Android and iOS) to work in conjunction with the	web application	● Drive the hiring process for frontend developers and engineers and play a mentoring role by	providing advice and coaching	● Define and oversee the development stack used by the core product	● Investigate, analyze and make recommendations to management regarding technology	improvements, upgrades and modifications	● Experience with agile development is a plus	● Develop features across multiple subsystems by driving requirements gathering, design, testing	and deployment	Candidate Qualifications	Technical	● Experience building scalable, distributed, high transaction web applications	● Experience with source code management systems such as Git	● Expertise in at least one web application framework	Ubuntu Capital is an equal opportunity employer regardless of race, color, religion, creed, sex, marital status, national origin, disability, age, veteran status, on-the-job injury, sexual orientation, political affiliation or belief. Employment decisions are made without consideration of these or any other factors that employers are prohibited by law from considering.	www.ubuntucapital.com November 2014	￼● Expertise in one or more powerful high level languages, such as Ruby, Python, Scala, or Closure	● Experience in building applications using various relational databases	● Familiarity with managed cloud computing solutions such as AWS, Rackspace or Google Apps	● Ability to leverage asynchronous programming, queuing, caching, logging security and	persistence where appropriate	● Ability to demonstrate success in building and ‘shipping’ a product or playing a major role in a	‘shipped’ product	● Ability to provide our team with any samples of your work / projects a plus	● Game for learning whatever else the job requires!	Personal	● A passion for our mission of expanding the reach of the formal financial sector to under banked populations globally	● A strong desire to work in an early-stage, for-profit social enterprise	● An unparalleled attention to detail	● Excellent written and oral communication skills	● A strong sense of humor (finding yourself amusing qualifies)	Professional	● Ability to articulate feasible technology choices, cater discussions to appropriate audiences and lead technical conversations with senior management	● Ability to leverage various productivity tools such as ticket / task management, collaboration, communication, wiki tools and calendar tools among others	Educational	● Bachelor of Science with a major in Computer Science, Engineering, Applied Math or equivalent. Academic distinctions a plus	● MS in Computer Science, Engineering, Applied Math or equivalent a plus	Logistics	Timing. Hiring will be completed on a rolling basis until the position is filled.	Process. Please send your resume and cover letter to info@ubuntucapital.com. Hiring will likely consist of two to three rounds of interviews, a technical / programming exercise, and a reference check. Any questions may also be submitted to info@ubuntucapital.com.	Compensation. Compensation will be commensurate with experience level and expertise. Compensation will consist of base salary and equity in the Company. Benefits will include: flexible vacation, flexible hours, and significant work autonomy.	Ubuntu Capital is an equal opportunity employer regardless of race, color, religion, creed, sex, marital status, national origin, disability, age, veteran status, on-the-job injury, sexual orientation, political affiliation or belief. Employment decisions are made without consideration of these or any other factors that employers are prohibited by law from considering.'

// var ubuntuCapital = 'Leadership, trust, confidence';

var conf = JSON.parse(fs.readFileSync('./conf.json').toString());

var server = new Hapi.Server({
});

server.connection({port: conf.port, address: conf.url})

server.route({
	method: 'POST',
	path: '/syns',
	handler: function(request, reply) {
		console.log(request.payload);
		if (!request.payload.resumeText || !request.payload.refText) {
			var err = new Error('Request received which was missing resumeText or refText as payload keys\n');
			reply (err);
			throw err;
		}
		else {
			findSuggestions({resumeText: request.payload.resumeText, refText: request.payload.refText}, function(err, suggestions) {
				reply(suggestions);
			});
		}
	}
})

server.route({
	method: 'GET',
	path: '/assets/{fileName}',
	handler: {
		directory: {
			path: './static/assets'
		}
	}
})

server.route({
	method: 'GET',
	path: '/',
	handler: {
		file: {
			path: './static/index.html'
		}
	}
})

server.start(function() {
	console.log('server listening on', server.info.uri)
});

