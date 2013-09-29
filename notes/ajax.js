
    ajaxForm = function($form, params, done) {
        var form;
        if (form = $form[0]) {
            return $.ajax({
                context: form, // callback will be in this context
                type: params.type || $form.attr("method"),  // GET/POST/PUT/DELETE/etc
                url: $form.attr("action"),                  // URL
                data: params.data || $form.serialize(),     // JSON data
                success: done                               // Success callback
            })
        }
    }

    $(document).on("selectmenu:selected", ".js-issue-show-label-select-menu .js-navigation-item", function() {
        var e, n, i;
        return
            $form = $(this).closest("form"),
            input = $(this).find("input[type=checkbox]"),
            params = {
                    type: n.is(":checked") ? "put" : "delete",
                    data: {
                        "issues[]": e.find(".js-issue-number").val(),
                        "labels[]": n.val()
                    }
                },
            ajaxForm($form, params, function(result) {
                // Acts on the form
                return $(".discussion-labels > .color-label-list").html(result.labels)
            }),
            !1
    })

