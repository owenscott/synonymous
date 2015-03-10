

var getSuggestions = function(options) {
	$.ajax('syns', {

		type: 'POST',
		
		data: {
			resumeText: options.resumeText,
			refText: options.refText
		},
		
		success: function(response) {
			
			var suggestions = response.suggestions;

			console.log(response.transaction)
			$('.results').attr('data-transaction', response.transaction);


			// clear results			
			$('#results .results').html('');
			
			// display an error if no suggestions returned
			if (_.isEmpty(suggestions)) {
				alert('No potential synonyms found. Please try to paste more text for comparison.');
				$('#loading').toggle();
				$('#submission-form').toggle();
			}

			// show results
			else {

				// results string starts as an un-edited copy of the resume text
				var resultsString = options.resumeText;

				// iterate through all suggestions provided from server
				_.keys(suggestions).forEach(function(matchWord, i) {

					// look for those words in the resume text
					resultsString = resultsString.replace(new RegExp('(\\s'+ matchWord +'|' + matchWord + '\\s|' + matchWord + '$)', 'g'), function(word) {
						
						word = word.trim();
						console.log(word);
						var wordWithSuggestions = 'xxxxxx ' + word + 'yyyyyy' + ' (';
						suggestions[word].forEach(function(suggestion) {
							wordWithSuggestions = wordWithSuggestions + 'zzzzzz' + word + '" aaaaaa"' + suggestion + '"bbbbbb' + suggestion + 'cccccc, ';
						})
						wordWithSuggestions = wordWithSuggestions.slice(0, wordWithSuggestions.length - 2) + 'dddddd '
						return wordWithSuggestions;
					})
					
					return resultsString;

				})

				// extremely hacky escaping to avoid having to re-write
				// basically strong class suggetsion, data, etc. were getting caught in the regex
				// if you're reading this, don't judge too harshly. i wrote this whole application (client + server)
				// in three hours and I really want to get to sleep :/
				resultsString = resultsString.replace(/xxxxxx/g, '<span class="word-block"><strong class="word">')
				resultsString = resultsString.replace(/yyyyyy/g, '</strong>')
				resultsString = resultsString.replace(/zzzzzz/g, '<span class="suggestion-block" data-original="')
				resultsString = resultsString.replace(/aaaaaa/g, 'data-suggestion=')
				resultsString = resultsString.replace(/bbbbbb/g, '><span class="suggestion">')
				resultsString = resultsString.replace(/cccccc/g, '</span> <img src="assets/img/check.png" class="good"> <img src="assets/img/x.png" class="bad"></span>')
				resultsString = resultsString.replace(/dddddd/g, ')</span>');

				var resultsArr = resultsString.split(/\n/);
				resultsArr.forEach(function(p) {
					$('#results .results').append('<p>' + p + '</p>')
				})

				// handler for users interacting w/ suggestions
				$('.good, .bad').on('click', function(e) {

					var clickType = e.target.className,
							payload = $(e.target).parent().data();

					payload.verdict = clickType;
					payload.transactionId = $('.results').data('transaction');

					// send async
					$.ajax('analytics', {
						
						type: 'POST',

						data: payload,

						success: function() {
							console.log('Thanks! Feedback submitted.')
						},

						error: function(err) {
							$('body').append('<div class="warn"><p>If you see this can you shoot Owen an email? Thanks!</p><p>' + JSON.stringify(err) + '</p></div>')
						}


					})

					// update DOM
					if (clickType === 'good') {
						$(e.target).closest('.word-block').find('.word').html('<span class="suggestion accepted">' + payload.suggestion + '</span>');
						$(e.target).closest('.word-block').find('.suggestion-block').remove();
					}
					else if (clickType === 'bad') {
						$(e.target).closest('.word-block').find('.suggestion-block').remove();
					}


				})
				
				$('#loading').toggle({duration:2000});
				$('#results').toggle({duration:2000});
			}
		},
		error: function(err) {
			$('#loading').toggle();
			$('#results').html(JSON.stringify(err));
			$('#results').toggle();
		},
		timeout: function() {
			$('#results').toggle();
			$('#results').html('<p>Error loading your results. Please contact the Resutron team</p>')
		},
		beforeSend: function() {
			$('#submission-form').toggle();
			$('#loading').toggle();
		}
	})
}

$(document).ready(function() {
	$('#submission-form button').on('click', function(e) {

		resumeText = $('#resumeText').val();
		refText = $('#refText').val();

		if (!resumeText || !refText) {
			alert('You gotta put something for resume text and the job description')
		}
		else {
			e.preventDefault();
			getSuggestions({
				resumeText: resumeText,
				refText: refText
			});
		}


	})


	$('#go-back').on('click', function(e) {
		$('#results').toggle();
		$('#submission-form').toggle();
	})
})