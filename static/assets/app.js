

var getSuggestions = function(options) {
	$.ajax('syns', {
		type: 'POST',
		data: {
			resumeText: options.resumeText,
			refText: options.refText
		},
		success: function(suggestions) {
			console.log(suggestions);
			if (_.isEmpty(suggestions)) {
				alert('No potential synonyms found. Please try to paste more text for comparison.');
				$('#submission-form').toggle();
			}
			else {

				var resultsString = options.resumeText;
				_.keys(suggestions).forEach(function(matchWord, i) {
					resultsString = resultsString.replace(matchWord, function(word) {
						var wordWithSuggestions = '<strong>' + word + '</strong>' + ' (<span class="suggestion">';
						suggestions[word].forEach(function(suggestion) {
							wordWithSuggestions = wordWithSuggestions + suggestion + '</span>, ';
						})
						wordWithSuggestions = wordWithSuggestions.slice(0, wordWithSuggestions.length - 2) + ')'
						return wordWithSuggestions;
					})
					return resultsString;
				})

				$('#results').html('<h2>Suggestions</h2>\n')
				var resultsArr = resultsString.split(/\n/);
				resultsArr.forEach(function(p) {
					$('#results').append('<p>' + p + '</p>')
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
})