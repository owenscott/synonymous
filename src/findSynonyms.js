
var _ = require('underscore'),
		MongoClient = require('mongodb').MongoClient,
		request = require('request'),
		async = require('async');





// from ranks.nl
var stopWords = ['a\'s', 'able', 'about', 'above', 'according', 'accordingly', 'across', 'actually', 'after', 'afterwards', 'again', 'against', 'ain\'t', 'all', 'allow', 'allows', 'almost', 'alone', 'along', 'already', 'also', 'although', 'always', 'am', 'among', 'amongst', 'an', 'and', 'another', 'any', 'anybody', 'anyhow', 'anyone', 'anything', 'anyway', 'anyways', 'anywhere', 'apart', 'appear', 'appreciate', 'appropriate', 'are', 'aren\'t', 'around', 'as', 'aside', 'ask', 'asking', 'associated', 'at', 'available', 'away', 'awfully', 'be', 'became', 'because', 'become', 'becomes', 'becoming', 'been', 'before', 'beforehand', 'behind', 'being', 'believe', 'below', 'beside', 'besides', 'best', 'better', 'between', 'beyond', 'both', 'brief', 'but', 'by', 'c\'mon', 'c\'s', 'came', 'can', 'can\'t', 'cannot', 'cant', 'cause', 'causes', 'certain', 'certainly', 'changes', 'clearly', 'co', 'com', 'come', 'comes', 'concerning', 'consequently', 'consider', 'considering', 'contain', 'containing', 'contains', 'corresponding', 'could', 'couldn\'t', 'course', 'currently', 'definitely', 'described', 'despite', 'did', 'didn\'t', 'different', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'done', 'down', 'downwards', 'during', 'each', 'edu', 'eg', 'eight', 'either', 'else', 'elsewhere', 'enough', 'entirely', 'especially', 'et', 'etc', 'even', 'ever', 'every', 'everybody', 'everyone', 'everything', 'everywhere', 'ex', 'exactly', 'example', 'except', 'far', 'few', 'fifth', 'first', 'five', 'followed', 'following', 'follows', 'for', 'former', 'formerly', 'forth', 'four', 'from', 'further', 'furthermore', 'get', 'gets', 'getting', 'given', 'gives', 'go', 'goes', 'going', 'gone', 'got', 'gotten', 'greetings', 'had', 'hadn\'t', 'happens', 'hardly', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'s', 'hello', 'help', 'hence', 'her', 'here', 'here\'s', 'hereafter', 'hereby', 'herein', 'hereupon', 'hers', 'herself', 'hi', 'him', 'himself', 'his', 'hither', 'hopefully', 'how', 'howbeit', 'however', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'ie', 'if', 'ignored', 'immediate', 'in', 'inasmuch', 'inc', 'indeed', 'indicate', 'indicated', 'indicates', 'inner', 'insofar', 'instead', 'into', 'inward', 'is', 'isn\'t', 'it', 'it\'d', 'it\'ll', 'it\'s', 'its', 'itself', 'just', 'keep', 'keeps', 'kept', 'know', 'known', 'knows', 'last', 'lately', 'later', 'latter', 'latterly', 'least', 'less', 'lest', 'let', 'let\'s', 'like', 'liked', 'likely', 'little', 'look', 'looking', 'looks', 'ltd', 'mainly', 'many', 'may', 'maybe', 'me', 'mean', 'meanwhile', 'merely', 'might', 'more', 'moreover', 'most', 'mostly', 'much', 'must', 'my', 'myself', 'name', 'namely', 'nd', 'near', 'nearly', 'necessary', 'need', 'needs', 'neither', 'never', 'nevertheless', 'new', 'next', 'nine', 'no', 'nobody', 'non', 'none', 'noone', 'nor', 'normally', 'not', 'nothing', 'novel', 'now', 'nowhere', 'obviously', 'of', 'off', 'often', 'oh', 'ok', 'okay', 'old', 'on', 'once', 'one', 'ones', 'only', 'onto', 'or', 'other', 'others', 'otherwise', 'ought', 'our', 'ours', 'ourselves', 'out', 'outside', 'over', 'overall', 'own', 'particular', 'particularly', 'per', 'perhaps', 'placed', 'please', 'plus', 'possible', 'presumably', 'probably', 'provides', 'que', 'quite', 'qv', 'rather', 'rd', 're', 'really', 'reasonably', 'regarding', 'regardless', 'regards', 'relatively', 'respectively', 'right', 'said', 'same', 'saw', 'say', 'saying', 'says', 'second', 'secondly', 'see', 'seeing', 'seem', 'seemed', 'seeming', 'seems', 'seen', 'self', 'selves', 'sensible', 'sent', 'serious', 'seriously', 'seven', 'several', 'shall', 'she', 'should', 'shouldn\'t', 'since', 'six', 'so', 'some', 'somebody', 'somehow', 'someone', 'something', 'sometime', 'sometimes', 'somewhat', 'somewhere', 'soon', 'sorry', 'specified', 'specify', 'specifying', 'still', 'sub', 'such', 'sup', 'sure', 't\'s', 'take', 'taken', 'tell', 'tends', 'th', 'than', 'thank', 'thanks', 'thanx', 'that', 'that\'s', 'thats', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'thence', 'there', 'there\'s', 'thereafter', 'thereby', 'therefore', 'therein', 'theres', 'thereupon', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'think', 'third', 'this', 'thorough', 'thoroughly', 'those', 'though', 'three', 'through', 'throughout', 'thru', 'thus', 'to', 'together', 'too', 'took', 'toward', 'towards', 'tried', 'tries', 'truly', 'try', 'trying', 'twice', 'two', 'un', 'under', 'unfortunately', 'unless', 'unlikely', 'until', 'unto', 'up', 'upon', 'us', 'use', 'used', 'useful', 'uses', 'using', 'usually', 'value', 'various', 'very', 'via', 'viz', 'vs', 'want', 'wants', 'was', 'wasn\'t', 'way', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'welcome', 'well', 'went', 'were', 'weren\'t', 'what', 'what\'s', 'whatever', 'when', 'whence', 'whenever', 'where', 'where\'s', 'whereafter', 'whereas', 'whereby', 'wherein', 'whereupon', 'wherever', 'whether', 'which', 'while', 'whither', 'who', 'who\'s', 'whoever', 'whole', 'whom', 'whose', 'why', 'will', 'willing', 'wish', 'with', 'within', 'without', 'won\'t', 'wonder', 'would', 'wouldn\'t', 'yes', 'yet', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves', 'zero'];


var extractUniqueTerms = function(text) {
	// remove any word with a numner in it, as well as any email address
	text = text.replace(/[^\s]+[0-9@][^\s]+/g, '')
	// remove punctuation
	text = text.replace(/[^\w\s\-]/g, '');
	// lower case
	text = text.toLowerCase();
	// split on whitespace
	var textArr = text.split(/[\s\-]/);
	// unique terms only
	textArr = _.uniq(textArr);
	
	return textArr;

}

var removeCommonWords = function(textArr) {
	return _.difference(textArr, stopWords);
}

var clean = function(text) {
	var textArr = extractUniqueTerms(text);
	textArr = removeCommonWords(textArr);
	return textArr;
}

var getSynonyms = function(textArr, callback) {

	var syns = {};

	MongoClient.connect('mongodb://localhost:27017/wordCache', function(err, db) {
		
		if (err) {
			console.log('Mongo Error', err);
		}
		async.eachLimit(

			textArr,

			2,

			function(word, callback) {

				db.collection('words').find({word: word}).toArray(function(err, arr) {

					var addSyns = function(word) {
						word.syns.forEach(function(syn) {
							syns[syn.word] = syns[syn.word] || word.word;
						})
					}
					
					if (_.isEmpty(arr)) {
						console.log('No match found for', word);
						// get the word from the API
						request('http://words.bighugelabs.com/api/2/39ca5993b822844369d857ef369b74dd/' + word + '/', function(err, resp, body){
							var synonymArr = body.split('\n');
							synonymArr = _.chain(synonymArr).map(function(syn) {
								var parts = syn.split('|');
								return {
									type: parts[0],
									word: parts[2]
								}
							}).value();
							db.collection('words').insert({word: word, syns: synonymArr}, function(err, result) {
								if (err) {
									console.log(err);
								}
								addSyns(result[0]);
								callback();
							})
							
						})
					}

					else {
						addSyns(arr[0]);
						callback();
					}

				})
			},

			function(err) {
				var wrapper = function() {
					callback(null, syns);
				}
				process.nextTick(wrapper);
				db.close();	
			}
		)
				
	})


}


module.exports = function(args, callback) {
	var resumeTextArr = clean(args.resumeText),
			refTextArr = clean(args.refText);

	getSynonyms(refTextArr, function(err, syns) {
		
		var suggestions = {};

		resumeTextArr.forEach(function(word) {
			if (syns[word]) {
				if (suggestions[word]) {
					suggestions[word].push(syns[word]);
				}
				else {
					suggestions[word] = [syns[word]];
				}
			}
		})

		var wrapper = function() {
			callback(err, suggestions);
		}
		process.nextTick(wrapper);
	})


}

//Thesaurus service provided by words.bighugelabs.com

// 39ca5993b822844369d857ef369b74dd

