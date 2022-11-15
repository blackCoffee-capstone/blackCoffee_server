$(document).ready(function () {
	$('.main_menu').click(function () {
		$('.sub_menu').slideUp();
		if ($(this).children('.sub_menu').is(':hidden')) {
			$(this).children('.sub_menu').slideDown();
		} else {
			$(this).children('.sub_menu').slideUp();
		}
	});

	$('#append_row').on('click', function () {
		$('#list_table').append(
			$('<tr>').append(
				$('<td>').append($('#add_no').val()),
				$('<td>').append($('#add_id').val()),
				$('<td>').append($('#add_business').val()),
				$('<td>').append($('#add_email').val()),
				$('<td>').append($('#add_date').val()),
				$('<td>').append($('#add_status').val()),
				$('<td>').append($('<a>').prop('href', '#').addClass('detail-link').append('DETAIL')),
				$('<td>').append($('<a>').prop('href', '#').addClass('delete-link').append('DELETE')),
			),
		);
	});

	$('#list_table').on('click', '.delete-link', function () {
		$(this).parent().parent().remove();
	});

	$('#list_table').on('click', '.detail-link', function (event) {
		$('#popup').show();
		$('body').append('<div class="backon"></div>');
	});

	$('body').on('click', function (event) {
		if (event.target.className == 'close' || event.target.className == 'backon') {
			$('#popup').hide();
			$('.backon').hide();
		}
	});
});
