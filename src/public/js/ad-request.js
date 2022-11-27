$(document).ready(function () {
	$('.main_menu').click(function () {
		$('.sub_menu').slideUp();
		if ($(this).children('.sub_menu').is(':hidden')) {
			$(this).children('.sub_menu').slideDown();
		} else {
			$(this).children('.sub_menu').slideUp();
		}
	});

	var table = $('#list_table').DataTable({
		ajax: { url: '/js/ad-form.json', dataType: 'json' },
		columns: [
			{ data: 'id' },
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
		responsive: {
			details: {
				type: 'column',
				target: 'tr',
				display: $.fn.dataTable.Responsive.display.modal({
					header: function (row) {
						var data = row.data();
						return 'Details for ' + data.business_name;
					},
				}),
				renderer: $.fn.dataTable.Responsive.renderer.tableAll({
					tableClass: 'list_table',
				}),
			},
		},
		ordering: true,
		lengthChange: false,
		pagingType: 'full_numbers',
		info: true,
		autoWidth: false,
	});

	$('body').on('click', function (event) {
		if (event.target.className == 'close' || event.target.className == 'backon') {
			$('#popup').hide();
			$('.backon').hide();
			location.reload();
		}
	});

	$('#list_table').on('click', 'td', function () {
		$('#popup').show();
		$('.modal-body').empty();
		var data_list = '';
		var row_data = table.row(this).data();
		var img_data = '<img src="' + row_data.license_url + '" alt="license">';
		console.log(row_data);

		$('.modal-body').append('<div> 회사명 : ' + row_data.business_name + '</div>');
		$('.modal-body').append('<div> 위치 : ' + row_data.geom + '</div>');
		$('.modal-body').append('<div> 이메일 : ' + row_data.email + '</div>');
		$('.modal-body').append('<div> 전화번호 : ' + row_data.phone_number + '</div>');
		$('.modal-body').append('<div>사업자 등록증</div>');
		$('.modal-body').append(img_data);

		$('#popup').append(data_list);
		$('body').append('<div class="backon"></div>');
	});
});
