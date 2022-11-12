$(document).ready(function () {
	console.log(localStorage.getItem('accessToken')); //토큰 저장 확인(삭제 예정)
	console.log(localStorage.getItem('refreshToken')); //토큰 저장 확인(삭제 예정)
	$('.main_menu').click(function () {
		$('.sub_menu').slideUp();
		if ($(this).children('.sub_menu').is(':hidden')) {
			$(this).children('.sub_menu').slideDown();
		} else {
			$(this).children('.sub_menu').slideUp();
		}
	});
});
