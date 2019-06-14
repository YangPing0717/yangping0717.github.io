var form = (function(){

    var selector;

    return {
        init : function( s ){

            selector = s;

            if ( selector.find('[rel="editor"]').length > 0 ) {

                var uploadurl = selector.find('.froala-editor').data('uploadurl');

                selector.find('[rel="editor"]').froalaEditor({
                    toolbarButtons: [
                        'bold', 'italic', 'underline',/* 'strikeThrough', 'subscript', 'superscript',*/ '|',
                        'fontFamily', 'fontSize', 'color', 'clearFormatting', '|',
                        'align', 'formatOL', 'formatUL', /*'outdent', 'indent', '-',*/
                        'fullscreen', '|', 'insertLink', 'insertImage', 'category', 'insertTable', 'undo', 'redo', 'html',
                    ],
                    height: 350,
                    placeholderText: '',

                    imageUpload: true,
                    imageUploadMethod:'POST',
                    imageUploadURL: uploadurl,
                    requestHeaders: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                });

                // $('[href="https://www.froala.com/wysiwyg-editor?k=u"]').parent().remove()
            }


            if ( selector.find('[rel="tag"]').length > 0 ) {
                selector.find('[rel="tag"]').tagsinput();
                $('.bootstrap-tagsinput').css('border-radius', '0');
                $('.bootstrap-tagsinput').css('margin-left', '10px');
                $('.bootstrap-tagsinput').css('padding', '5px 6px 1px');
            }



            // $('body').on('keyup keypress', function(e) {
            //     var keyCode = e.keyCode || e.which;
            //     if (keyCode === 13) {
            //         e.preventDefault();
            //         return false;
            //     }
            // });

        }
    }


})();
