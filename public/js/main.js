/**
 * JUST ONLY TEST SERVER AND CLIENT
 * Bind Event Click to element when Re-Render
 * In the Real world, not render after Send AJAX SUCCESS
 * The Dom should Remove  :)
 */



$(document).ready(function() {
    bindDeleteUser();

    function bindDeleteUser() {
        var $deleteUser = $('.deleteUser');

        $deleteUser.on('click', function(e) {
            e.preventDefault();
            var that = this;
            var idEl = $(that).data('id');
            deleteUser(idEl);
        });


        // Request AJAX with AXIOS
        function deleteUser(id) {
            axios.delete('/users/delete/' + id)
                .then(function(result) {
                    var $idListUser = $('#listuser');
                    var listUser = '';

                    $.each(result.data, function(k, v) {
                        listUser += `<li>${v.first_name}<a href="#" data-id="${v._id}" class="deleteUser">Delete</a></li>`;
                    });
                    listUser = '<ul>' + listUser + '</ul>';
                    $idListUser.html(listUser);

                    bindDeleteUser();

                })
                .catch(function(err) {
                    alert('FAILLL');
                });
        }



        // REQUEST AJAX WITH JQUERY

        // function deleteUser(id) {
        //     $.ajax({
        //         url: '/users/delete/' + id,
        //         type: 'DELETE'

        //     }).done(function(result) {
        //         var $idListUser = $('#listuser');
        //         var listUser = '';
        //         $.each(result, function(k, v) {
        //             listUser += `<li>${v.first_name}<a href="#" data-id="${v._id}" class="deleteUser">Delete</a></li>`;
        //         });
        //         listUser = '<ul>' + listUser + '</ul>';
        //         $idListUser.html(listUser);

        //         bindDeleteUser();

        //     }).fail(function(err) {
        //         alert('FAILLL');
        //     });
        // }
    }
});