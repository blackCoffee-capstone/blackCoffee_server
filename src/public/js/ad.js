$(document).ready(function () {
	var accessToken = localStorage.getItem('accessToken');
	var refreshToken = localStorage.getItem('refreshToken');

	if ((accessToken != null) & (refreshToken != null)) {
		jwtPayload = JSON.parse(window.atob(accessToken.split('.')[1]));

		var param = {
			refreshToken: refreshToken,
		};
		if (jwtPayload.exp * 1000 < new Date().getTime()) {
			console.log('Time Expired');
			$.ajax({
				url: '/auth/token-refresh',
				type: 'POST',
				data: param,
				headers: { Authorization: 'Bearer ' + accessToken },
				dataType: 'JSON',
				success: function (data) {
					localStorage.setItem('accessToken', data.accessToken);
					window.location.reload();
				},
				error: function (data) {
					console.log(data);
				},
			});
		}
	} else {
		$.ajax({
			url: '/users',
			type: 'Get',
			headers: { Authorization: 'Bearer ' + accessToken },
			success: function (data) {
				if (data.type != 'Admin') {
					alert('관리자 권한이 필요합니다.');
					window.location.href = '/admin/login';
				}
			},
			error: function () {
				alert('관리자 권한이 필요합니다.');
				window.location.href = '/admin/login';
			},
		});
	}

	$('.main_menu').click(function () {
		$('.sub_menu').slideUp();
		if ($(this).children('.sub_menu').is(':hidden')) {
			$(this).children('.sub_menu').slideDown();
		} else {
			$(this).children('.sub_menu').slideUp();
		}
	});

	$.ajax({
		url: '/admins/adsAll',
		type: 'Get',
		dataType: 'json',
		dataSrc: '',
		headers: { Authorization: 'Bearer ' + accessToken },
		success: function (response) {
			table = $('#list_table').DataTable({
				data: response,
				columns: [
					{
						data: null,
						render: function (data, type, row, meta) {
							return meta.row + meta.settings._iDisplayStart + 1;
						},
					},
					{ data: 'businessName' },
					{ orderable: false, data: 'email' },
					{
						data: null,
						title: 'DATE',
						width: 100,
						render: function (data) {
							let date = '' + data.createdAt;
							return date.substring(0, 10);
						},
					},
					{ data: 'click' },
					{
						orderable: false,
						data: null,
						render: function (data) {
							return '<a href="#" class="detail-link">DETAIL</a>';
						},
					},
				],
				ordering: true,
				lengthChange: false,
				pagingType: 'full_numbers',
				info: true,
				autoWidth: false,
			});
		},
		error: function (response) {
			console.log(response.responseText);
		},
	});

	$('body').on('click', function (event) {
		if (event.target.className == 'close' || event.target.className == 'backon') {
			$('.popup').hide();
			$('.backon').hide();
			location.reload();
		}
	});

	$('.btn-register').click(function () {
		$('.popup-register').show();
		$('body').append('<div class="backon"></div>');
		$('.btn-submit').click(function () {
			var result = confirm('정말로 등록하시겠습니까?');
			var form = $('#ad-register')[0];
			var formData = new FormData(form);
			var isEmpty = false;
			if (result) {
				$('#ad-register')
					.find('input[type!="hidden"]')
					.each(function () {
						if (!$(this).val()) {
							isEmpty = true;
						}
					});

				if (isEmpty) {
					alert('데이터를 전부 입력해주세요!');
					return false;
				}

				$.ajax({
					cache: false,
					url: '/admins/ads',
					type: 'POST',
					processData: false,
					contentType: false,
					data: formData,
					headers: { Authorization: 'Bearer ' + accessToken },
					success: function (data) {
						alert('등록 완료!');
						window.location.reload();
					},
					error: function (request, status, error) {
						if (request.responseText.includes('"message":"Ad is already registered"') == true) {
							alert('이미 등록된 광고입니다.');
						} else {
							alert('유효한 값을 입력해주세요!');
						}
					},
				});
			}
		});
	});

	$('#list_table').on('click', 'td', function () {
		var row_data = table.row(this).data();
		if (typeof row_data != 'undefined') {
			$('.popup-detail').show();
			$('.ad-body').empty();
		}
		$.ajax({
			url: '/admins/ads/' + row_data.id,
			type: 'GET',
			dataType: 'json',
			dataSrc: '',
			headers: { Authorization: 'Bearer ' + accessToken },
			success: function (adform) {
				var img_data = '<img src="' + adform.photoUrl + '" alt="license" class="photo-url">';
				$('.modal-body').append('<div> 회사명 : ' + adform.businessName + '</div>');
				$('.modal-body').append('<div> 위치 : ' + adform.address + '</div>');
				$('.modal-body').append('<div> 이메일 : ' + adform.email + '</div>');
				$('.modal-body').append(
					'<div> 홈페이지 : <a href = "//' +
						adform.pageUrl +
						'" target="_blank">' +
						adform.pageUrl +
						'</a></div>',
				);
				$('.modal-body').append('<div> 광고 클릭 수 : ' + adform.click + '</div>');
				$('.modal-body').append('<div>광고 배너</div>');
				$('.modal-body').append(img_data);
				$('body').append('<div class="backon"></div>');
			},
			error: function (response) {
				alert(response.responseText);
			},
		});

		$('.btn-edit').click(function () {
			$('.ad-body').empty();
			$('.ad-footer').hide();
			$.ajax({
				url: '/admins/ads/' + row_data.id,
				type: 'GET',
				dataType: 'json',
				dataSrc: '',
				headers: { Authorization: 'Bearer ' + accessToken },
				success: function (ad) {
					$('.modal-body').append('<form id="ad-edit">');
					$('.modal-body').append(
						'<div> 회사명 : <input class="input input-business" type="text" name="businessName" placeholder="' +
							ad.businessName +
							'" /> </div>',
					);
					$('.modal-body').append(
						'<div> 이메일 : <input class="input input-email" type="email" name="email" placeholder="' +
							ad.email +
							'" /> </div>',
					);
					$('.modal-body').append(
						'<div> 홈페이지 : <input class="input input-page" type="text" name="pageUrl" placeholder="' +
							ad.pageUrl +
							'" /> </div>',
					);
					$('.modal-body').append(
						'<div> 주소 : <input class="input input-address" type="text" name="address" placeholder="' +
							ad.address +
							'" /> </div>',
					);
					$('.modal-body').append(
						'<div> 배너 수정 : <input class="input input-file" type="file" name="file"/> </div>',
					);

					$('.modal-body').append('<button class="btn edit-complete" type="button">수정</button>');
					$('.modal-body').append('</form>');
				},
			});

			$(document).on('click', '.edit-complete', function (e) {
				e.preventDefault();
				var result = confirm('정말로 수정하시겠습니까?');

				var form = new FormData();

				if ($('.input-business').val() != '') {
					form.append('businessName', $('.input-business').val());
				}

				if ($('.input-email').val() != '') {
					form.append('email', $('.input-email').val());
				}

				if ($('.input-page').val() != '') {
					form.append('pageUrl', $('.input-page').val());
				}

				if ($('.input-address').val() != '') {
					form.append('address', $('.input-address').val());
				}

				if ($('.input-file').val()) {
					form.append('file', $('.input-file')[0].files[0]);
				}

				if (result) {
					$.ajax({
						url: '/admins/ads/' + row_data.id,
						type: 'PATCH',
						processData: false,
						contentType: false,
						data: form,
						headers: { Authorization: 'Bearer ' + accessToken },
						success: function (data) {
							alert('변경 완료!');
							window.location.reload();
						},
						error: function (data) {
							alert('유효한 값을 입력해주세요!');
						},
					});
				}
			});
		});

		$('.btn-delete').click(function () {
			var result = confirm('해당 광고를 정말로 삭제하시겠습니까?');
			if (result) {
				$.ajax({
					url: '/admins/ads/' + row_data.id,
					type: 'DELETE',
					processData: false,
					data: '',
					headers: { Authorization: 'Bearer ' + accessToken },
					success: function (data) {
						alert('삭제 완료!');
						window.location.reload();
					},
					error: function (data) {
						console.log(data);
					},
				});
				$('.popup').hide();
				$('.backon').hide();
			} else {
			}
		});
	});

	$('.logout').click(function () {
		$.ajax({
			url: '/auth/logout',
			type: 'POST',
			headers: { Authorization: 'Bearer ' + accessToken },
			success: function (data) {
				localStorage.clear();
				alert('로그아웃 성공!');
				location.reload();
			},
			error: function (data) {
				console.log(data);
			},
		});
	});

	$('.btn-update').click(function () {
		location.reload();
	});

	$('.icon-home').click(function () {
		window.location.href = '/admin';
	});
});
