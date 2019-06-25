     $('.menuTrigger').click( function () {
    	  $('.sidebarright').toggleClass('isOpen');
			 $('.wrapper_sr').toggleClass('pushed');
		});

		$('.openSubsidebarright').click( function() {
    		$(this).next('.subsidebarright').addClass('isOpen');	
		});

		$('.closeSubsidebarright').click( function() {
    		$('.subsidebarright').removeClass('isOpen');
		});

		$('.closesidebarright').click( function() {
   	    $('.sidebarright').removeClass('isOpen');
			  $('.wrapper_sr').removeClass('pushed');
		});