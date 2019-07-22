import { $, $doc } from './_utility';

/*------------------------------------------------------------------

  Init AJAX Forms

-------------------------------------------------------------------*/
function initForms() {
    const self = this;

    // Create Spinners in input number
    $('<span class="nk-form-control-number-up"></span>').insertAfter('.nk-form-control-number input');
    $('<span class="nk-form-control-number-down"></span>').insertAfter('.nk-form-control-number input');
    $doc.on('click', '.nk-form-control-number-up', function () {
        const $input = $(this).siblings('input');
        const max = $input.attr('max') || 9999999;
        let newVal;

        const oldValue = parseFloat($input.val());
        if (oldValue >= max) {
            newVal = oldValue;
        } else {
            newVal = oldValue + 1;
        }
        $input.val(newVal);
        $input.trigger('change');
    });
    $doc.on('click', '.nk-form-control-number-down', function () {
        const $input = $(this).siblings('input');
        const min = $input.attr('min') || -9999999;
        let newVal;

        const oldValue = parseFloat($input.val());
        if (oldValue <= min) {
            newVal = oldValue;
        } else {
            newVal = oldValue - 1;
        }
        $input.val(newVal);
        $input.trigger('change');
    });

    if (typeof $.validator === 'undefined') {
        return;
    }

    // Validate Forms
    $('form:not(.nk-form-ajax):not([novalidate])').each(function () {
        $(this).validate({
            errorClass: 'nk-error',
            errorElement: 'div',
            errorPlacement(error, element) {
                const $parent = element.parent('.input-group');
                const $parentNumber = element.parent('.nk-form-control-number');
                if ($parent.length) {
                    $parent.after(error);
                } else if ($parentNumber.length) {
                    $parentNumber.parent().after(error);
                } else {
                    element.after(error);
                }
                self.debounceResize();
            },
        });
    });
    // ajax form
    $('form.nk-form-ajax:not([novalidate])').each(function () {
        $(this).validate({
            errorClass: 'nk-error',
            errorElement: 'div',
            errorPlacement(error, element) {
                const $parent = element.parent('.input-group');
                if ($parent.length) {
                    $parent.after(error);
                } else {
                    element.after(error);
                }
                self.debounceResize();
            },
            // Submit the form via ajax (see: jQuery Form plugin)
            submitHandler(form) {
                const $form = $(form);
                const $responseSuccess = $form.find('.nk-form-response-success');
                const $responseError = $form.find('.nk-form-response-error');

                $.ajax({
                    type: 'POST',
                    url: $form.attr('action'),
                    data: $form.serialize(),
                    success(response) {
                        response = JSON.parse(response);
                        if (response.type && response.type === 'success') {
                            $responseError.hide();
                            $responseSuccess.html(response.response).show();
                            form.reset();
                        } else {
                            $responseSuccess.hide();
                            $responseError.html(response.response).show();
                        }
                        self.debounceResize();
                    },
                    error(response) {
                        $responseSuccess.hide();
                        $responseError.html(response.responseText).show();
                        self.debounceResize();
                    },
                });
            },
        });
    });
}

export { initForms };
