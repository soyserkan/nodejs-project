"use strict";

// Class Definition
var KTLoginGeneral = function () {

    var login = $('#kt_login');

    var showErrorMsg = function (form, type, msg) {
        var alert = $('<div class="alert alert-' + type + ' alert-dismissible" role="alert">\
			<div class="alert-text">'+ msg + '</div>\
			<div class="alert-close">\
                <i class="flaticon2-cross kt-icon-sm" data-dismiss="alert"></i>\
            </div>\
		</div>');

        form.find('.alert').remove();
        alert.prependTo(form);
        //alert.animateClass('fadeIn animated');
        KTUtil.animateClass(alert[0], 'fadeIn animated');
        alert.find('span').html(msg);
    }

    // Private Functions
    var displaySignUpForm = function () {
        login.removeClass('kt-login--forgot');
        login.removeClass('kt-login--signin');

        login.addClass('kt-login--signup');
        KTUtil.animateClass(login.find('.kt-login__signup')[0], 'flipInX animated');
    }

    var displaySignInForm = function () {
        login.removeClass('kt-login--forgot');
        login.removeClass('kt-login--signup');

        login.addClass('kt-login--signin');
        KTUtil.animateClass(login.find('.kt-login__signin')[0], 'flipInX animated');
        //login.find('.kt-login__signin').animateClass('flipInX animated');
    }

    var displayForgotForm = function () {
        login.removeClass('kt-login--signin');
        login.removeClass('kt-login--signup');

        login.addClass('kt-login--forgot');
        //login.find('.kt-login--forgot').animateClass('flipInX animated');
        KTUtil.animateClass(login.find('.kt-login__forgot')[0], 'flipInX animated');

    }

    var handleFormSwitch = function () {
        $('#kt_login_forgot').click(function (e) {
            e.preventDefault();
            displayForgotForm();
        });

        $('#kt_login_forgot_cancel').click(function (e) {
            e.preventDefault();
            displaySignInForm();
        });

        $('#kt_login_signup').click(function (e) {
            e.preventDefault();
            displaySignUpForm();
        });

        $('#kt_login_signup_cancel').click(function (e) {
            e.preventDefault();
            displaySignInForm();
        });
    }

    var handleSignInFormSubmit = function () {
        $('#kt_login_signin_submit').click(function (e) {
            e.preventDefault();
            var btn = $(this);
            var form = $(this).closest('form');

            form.validate({
                rules: {
                    email: {
                        required: true,
                        email: true
                    },
                    password: {
                        required: true
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);

            form.ajaxSubmit({
                url: './admin/login',
                type: 'POST',
                data: {
                    action: 'signin'
                },
                success: function (response, status, xhr, $form) {
                    // similate 2s delay
                    console.log(response);
                    if (response === 'notconfirmed') {
                        btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                        showErrorMsg(form, 'warning', 'Lütfen giriş yapabilmek için mailinizi onaylayın');
                    } else if (response === 'emailConfirmed') {
                        btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                        showErrorMsg(form, 'success', 'Email adresiniz başarıyla onaylandı. Lütfen giriş yapınız.');
                    } else {
                        window.location.href = '/admin';
                    }
                },
                error: function (data) {
                    btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                    showErrorMsg(form, 'danger', 'Hatalı email ya da parola. Lütfen tekrar deneyiniz.');
                }
            });
        });
    };

    var handleSignUpFormSubmit = function () {
        $('#kt_login_signup_submit').click(function (e) {
            e.preventDefault();

            var btn = $(this);
            var form = $(this).closest('form');

            form.validate({
                rules: {
                    firstname: {
                        required: true
                    },
                    lastname: {
                        required: true
                    },
                    email: {
                        required: true,
                        email: true
                    },
                    password: {
                        required: true
                    },
                    rpassword: {
                        required: true,
                        equalTo: '#password'
                    },
                    agree: {
                        required: true
                    }
                },
                messages: {
                    firstname: {
                        required: 'Bu alan boş bırakılamaz'
                    },
                    lastname: {
                        required: 'Bu alan boş bırakılamaz'
                    },
                    email: {
                        required: 'Bu alan boş bırakılamaz'
                    },
                    password: {
                        required: 'Bu alan boş bırakılamaz'
                    },
                    rpassword: {
                        required: 'Bu alan boş bırakılamaz',
                        equalTo: 'Şifreleriniz birbiriyle eşleşmiyor'
                    },
                    agree: {
                        required: 'Bu alan boş bırakılamaz'
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);

            form.ajaxSubmit({
                url: './admin/login',
                type: 'POST',
                data: {
                    action: 'signup'
                },
                success: function (response, status, xhr, $form) {
                    // similate 2s delay
                    btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                    form.clearForm();
                    form.validate().resetForm();

                    // display signup form
                    displaySignInForm();
                    var signInForm = login.find('.kt-login__signin form');
                    signInForm.clearForm();
                    signInForm.validate().resetForm();

                    showErrorMsg(signInForm, 'success', 'Teşekkür ederiz. Üyeliğinizi tamamlamak için emailinizi kontrol ediniz.');
                },
                error: function (response) {
                    btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                    form.clearForm();
                    form.validate().resetForm();
                    showErrorMsg(form, 'warning', 'Bu mail adresiyle önceden hesap oluşturulmuş. Lütfen giriş yapınız.');
                },
            });
        });
    }

    var handleForgotFormSubmit = function () {
        $('#kt_login_forgot_submit').click(function (e) {
            e.preventDefault();

            var btn = $(this);
            var form = $(this).closest('form');

            form.validate({
                rules: {
                    email: {
                        required: true,
                        email: true
                    }
                },
                messages: {
                    email: {
                        required: 'Bu alan zorunludur',
                        email: 'Lütfen geçerli bir mail adresi giriniz'
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);

            form.ajaxSubmit({
                url: './admin/login',
                type: 'POST',
                data: {
                    action: 'forgot'
                },
                success: function (response, status, xhr, $form) {
                    if (response) {
                        btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false); // remove
                        form.clearForm(); // clear form
                        form.validate().resetForm(); // reset validation states
                        showErrorMsg(form, 'success', 'Şifre yenilemek için e-posta adresinize bir bağlantı gönderdik! Lütfen şifrenizi güncelleyiniz');
                        // display signup form
                        // displaySignInForm();
                        // var signInForm = login.find('.kt-login__signin form');
                        // signInForm.clearForm();
                        // signInForm.validate().resetForm();
                        // showErrorMsg(signInForm, 'success', 'Şifre yenilemek için e-posta adresinize bir bağlantı gönderdik! Lütfen şifrenizi güncelleyiniz');
                    }
                },
                error: function (response) {
                    btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false); // remove
                    form.clearForm(); // clear form
                    form.validate().resetForm(); // reset validation states
                    showErrorMsg(form, 'warning', 'Böyle bir mail adresiyle tanımlı bir hesap bulunmamaktadır.');
                }
            });
        });
    }

    // Public Functions
    return {
        // public functions
        init: function () {
            handleFormSwitch();
            handleSignInFormSubmit();
            handleSignUpFormSubmit();
            handleForgotFormSubmit();
        }
    };
}();

// Class Initialization
jQuery(document).ready(function () {
    KTLoginGeneral.init();
});
