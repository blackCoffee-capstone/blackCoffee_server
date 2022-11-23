$(document).ready(function () {
	$('.main_menu').click(function () {
		$('.sub_menu').slideUp();
		if ($(this).children('.sub_menu').is(':hidden')) {
			$(this).children('.sub_menu').slideDown();
		} else {
			$(this).children('.sub_menu').slideUp();
		}
	});

	$('#list_table').DataTable({
		ajax: { url: '/js/ad-form.json', dataType: 'json' },
		columns: [
			{ data: 'id' },
			{ data: 'user' },
			{ data: 'business_name' },
			{ orderable: false, data: 'email' },
			{ data: 'created_at', width: 100 },
			{ data: 'status' },
			{
				orderable: false,
				title: 'DETAIL',
				data: null,
				render: function (data) {
					return '<a href="#" class="detail-link">DETAIL</a>';
				},
			},
		],
		responsive: true,
		ordering: true,
		lengthChange: false,
		pagingType: 'full_numbers',
		info: true,
		autoWidth: false,
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
