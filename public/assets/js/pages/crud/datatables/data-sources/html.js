"use strict";
var KTDatatablesDataSourceHtml = function () {

	var initTable1 = function () {
		var table = $('#kt_table_1');

		// begin first table
		table.DataTable({
			responsive: true,
			columnDefs: [
				{
					targets: -1,
					title: 'Actions',
					orderable: false,
					render: function (data, type, full, meta) {
						return `
                        <span class="dropdown">
                            <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="dropdown" aria-expanded="true">
                              <i class="la la-ellipsis-h"></i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-right">
                                <a class="dropdown-item" href="#"><i class="la la-edit"></i> Edit Details</a>
                                <a class="dropdown-item" href="#"><i class="la la-leaf"></i> Update Status</a>
                                <a class="dropdown-item" href="#"><i class="la la-print"></i> Generate Report</a>
                            </div>
                        </span>
                        <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="View">
                          <i class="la la-edit"></i>
                        </a>`;
					},
				},
				{
					targets: 8,
					render: function (data, type, full, meta) {
						var status = {
							1: { 'title': 'Pending', 'class': 'kt-badge--brand' },
							2: { 'title': 'Delivered', 'class': ' kt-badge--danger' },
							3: { 'title': 'Canceled', 'class': ' kt-badge--primary' },
							4: { 'title': 'Success', 'class': ' kt-badge--success' },
							5: { 'title': 'Info', 'class': ' kt-badge--info' },
							6: { 'title': 'Danger', 'class': ' kt-badge--danger' },
							7: { 'title': 'Warning', 'class': ' kt-badge--warning' },
						};
						if (typeof status[data] === 'undefined') {
							return data;
						}
						return '<span class="kt-badge ' + status[data].class + ' kt-badge--inline kt-badge--pill">' + status[data].title + '</span>';
					},
				},
				{
					targets: 9,
					render: function (data, type, full, meta) {
						var status = {
							1: { 'title': 'Online', 'state': 'danger' },
							2: { 'title': 'Retail', 'state': 'primary' },
							3: { 'title': 'Direct', 'state': 'success' },
						};
						if (typeof status[data] === 'undefined') {
							return data;
						}
						return '<span class="kt-badge kt-badge--' + status[data].state + ' kt-badge--dot"></span>&nbsp;' +
							'<span class="kt-font-bold kt-font-' + status[data].state + '">' + status[data].title + '</span>';
					},
				},
			],
		});

	};
	var initTable2 = function () {
		var table = $('#postsTable');

		// begin first table
		table.DataTable({
			responsive: true,
			columnDefs: [
				{
					targets: -1,
					title: 'İşlemler',
					orderable: false,
					render: function (data, type, full, meta) {
						return `
                        <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Düzenle" data-toggle="modal" data-id="${data}" rowId="${meta.row}" id="editPost" data-target="#kt_modal_4">
                          <i class="la la-edit"></i>
						</a>
						<a href="#" data-id="${data}" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Sil" id="deletePost">
						<i class="la la-trash"></i>
					    </a>`;
					},
				},
				{
					targets: 4,
					render: function (data, type, full, meta) {
						var status = {
							1: { 'title': 'Yayında', 'class': 'kt-badge--success' },
							2: { 'title': 'Özel', 'class': ' kt-badge--warning' },
							3: { 'title': 'Taslak', 'class': ' kt-badge--info' }
						};
						if (typeof status[data] === 'undefined') {
							return data;
						}
						return '<span class="kt-badge ' + status[data].class + ' kt-badge--inline kt-badge--pill">' + status[data].title + '</span>';
					},
				},
				{
					targets: 5,
					render: function (data, type, full, meta) {
						var status = {
							0: { 'title': 'Kapalı', 'state': 'danger' },
							1: { 'title': 'Açık', 'state': 'success' },
						};
						if (typeof status[data] === 'undefined') {
							return data;
						}
						return '<span class="kt-badge kt-badge--' + status[data].state + ' kt-badge--dot"></span>&nbsp;' +
							'<span class="kt-font-bold kt-font-' + status[data].state + '">' + status[data].title + '</span>';
					},
				},
			],
		});

	};

	return {

		//main function to initiate the module
		init: function () {
			initTable1();
			initTable2();
		},

	};

}();

jQuery(document).ready(function () {
	KTDatatablesDataSourceHtml.init();
});