moment.locale('tr');

$(document).on('click', '#addPost', () => {
    $('#newPostModal')[0].reset();
    $('.summernote').summernote('code', '');
    $('#exampleModalLabel').html('Ekle');
    $('#addNewPost').attr('name', 'insertPost');
});

$(document).on('click', '#deletePost', function (e) {
    e.preventDefault();
    const $button = $(this);
    const id = $(this).attr('data-id');
    $.confirm({
        title: 'Gönderiyi siliyorsunuz...',
        content: 'Gönderiyi silmek istediğinize emin misiniz?',
        type: 'green',
        buttons: {
            ok: {
                text: 'Sil!',
                btnClass: 'btn-danger',
                keys: ['enter'],
                action: () => {
                    $.ajax({
                        url: `/admin/posts/delete/${id}`,
                        method: 'DELETE',
                        data: id,
                        success: () => {
                            const table = $('#postsTable').DataTable();
                            table.row($button.parents('tr')).remove().draw();
                        }
                    });
                }
            },
            cancel: {
                text: 'İptal',
            }
        }
    });
});

$(document).on('click', 'button[name="insertPost"]', (e) => {
    e.preventDefault();
    const summernote = $('.summernote').summernote('code');
    const formData = new FormData(document.getElementById('newPostModal'));
    formData.append('p03', summernote);
    $.ajax({
        url: '/admin/posts',
        type: 'POST',
        contentType: false,
        processData: false,
        data: formData,
        success: (data) => {
            console.log(data[0]);
            $('#postsTable').DataTable().row.add([
                data[0].pid,
                `<img src='./uploads/${data[0].p04}' width='30' height='30' />`,
                data[0].p00,
                data[0].c00,
                data[0].p01,
                data[0].p02,
                moment(data[0].p05).format('Do MMMM YYYY'),
                data[0].pid,
            ]).draw();
            $('#kt_modal_4').modal('toggle');
        }
    });
});

$(document).on('click', '#editPost', function (e) {
    e.preventDefault();
    const id = $(this).attr('data-id');
    const rowId = $(this).attr('rowId');
    $.ajax({
        url: `/admin/posts/${id}`,
        type: 'GET',
        success: (data) => {
            $('#exampleModalLabel').html('Düzenle');
            $('#addNewPost').attr('name', 'updatePost');
            $('#addNewPost').attr('data-id', data[0].pid);
            $('#addNewPost').attr('rowId', rowId);
            $('input[name="p00"]').val(data[0].p00);
            $(`select[name='p01'] option[value='${data[0].p01}']`).attr('selected', true);
            $(`select[name='p06'] option[value='${data[0].p06}']`).attr('selected', true);
            (data[0].p02 === 1) ? $('input[name="p02"]').attr('checked', true) : $('input[name="p02"]').attr('checked', false);
            $('.summernote').summernote('code', data[0].p03);
        }
    });
});

$(document).on('click', 'button[name="updatePost"]', function (e) {
    e.preventDefault();
    const summernote = $('.summernote').summernote('code');
    const formData = new FormData(document.getElementById('newPostModal'));
    formData.append('p03', summernote);
    const id = $(this).attr('data-id');
    const rowId = $(this).attr('rowId');
    $.ajax({
        url: `/admin/posts/update/${id}`,
        type: 'PATCH',
        contentType: false,
        processData: false,
        data: formData,
        success: (data) => {
            $('#postsTable').DataTable().row(rowId).data([
                data[0].pid,
                `<img src='./uploads/${data[0].p04}' width='30' height='30' />`,
                data[0].p00,
                data[0].c00,
                data[0].p01,
                data[0].p02,
                moment(data[0].p05).format('Do MMMM YYYY'),
                data[0].pid,
            ]);
            $('#kt_modal_4').modal('toggle');
        }
    });
});