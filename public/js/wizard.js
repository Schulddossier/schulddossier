

window.onload = function () {
	maakUploadWizard();
}

function maakUploadWizard() {
	var scale = 3; // nog te bekijken

	$('completeDocument').onchange = function () {
		var URL = window.URL.createObjectURL(this.files[0]);
		laadPDF(URL);
	}
	
	maakLink({
		naam: 'Test link',
		onderwerp: 'test',
		container: $('stijlcontainer').querySelector('form'),
	});

	function laadPDF(URL) {
	
		var template = document.createElement('div');
		template.appendChild(document.createElement('div')).className = 'loep';
		
		var pages;
		PDFJS.getDocument(URL).then(function (pdf) {
			var wr = $('canvases');
			pages = pdf.numPages;
			for (var i=1;i<=pages;i+=1) {
				pdf.getPage(i).then(function (page) {
					var div = template.cloneNode(true);
					var canvas = document.createElement('canvas');
					canvas.id = 'id'+page.pageIndex;
					var viewport = page.getViewport(scale);
					var context = canvas.getContext('2d');
					canvas.width = viewport.width;
					canvas.height = viewport.height;

					var renderContext = {
						canvasContext: context,
						viewport: viewport
					};
					page.render(renderContext);
					div.appendChild(canvas);
					wr.appendChild(div);
//					logKlaar(page.pageIndex);
				});
			}
		});

		var logObj = {};

		function logKlaar(nummer) {
			logObj['p'+nummer] = true;
			for (var i=0;i<pages;i+=1) {
				if (!logObj['p'+i]) {
					return;
				}
			}
			PDFJS = null;

		}

		// hier closure afbreken
		// destroy PDFJS

	}

//	var groteCanvas = $('groot');
//	var nieuweContext = groteCanvas.getContext('2d');
	$('canvases').onclick = function (e) {
		var tgt = e.target;
		if (tgt.classList.contains('loep')) {
			console.log('Vergroot');
			return false;
		}
		if (tgt.classList.contains('actief')) {
			tgt = tgt.querySelector('canvas');
		}
		if (tgt.nodeName === 'CANVAS') {
			var div = tgt.parentNode;
			if (div.classList.contains('actief')) {
				div.classList.remove('actief');
			}
			/*
			groteCanvas.width = e.target.width;
			groteCanvas.height = e.target.height;
			nieuweContext.drawImage(e.target,0,0);
			*/
			div.classList.add('actief');
			if (actiefFormulier) {
				var nieuwID = e.target.id + 'copy';
				var canvas;
				if ($(nieuwID)) {
					canvas = $(nieuwID);
				} else {
					canvas = document.createElement('canvas');
					var thumbContext = canvas.getContext('2d');
					canvas.width = tgt.width;
					canvas.height = tgt.height;
					thumbContext.drawImage(tgt,0,0);
					canvas.id = nieuwID;
				}
				actiefFormulier.querySelector('.uploadCanvases').appendChild(canvas);
			}
		}
	}

	var actiefFormulier;
	document.querySelector('.naast').addEventListener('click',function (e) {
		var source = e.target;
		if (source.nodeName === 'H3') {
			console.log('wijzig formulier');
			wijzigActiefFormulier(source);
		} else if (source.classList.contains('nieuwDocument')) {
			console.log('Nieuw document');
		} else if (source.classList.contains('upload')) {
			console.log('Stuur formulier');
			stuurFormulier(source);
		}
		e.preventDefault();
	},false);


	function stuurFormulier(source) {
		var form = goUp(source,'FORM');
		var canvases = form.querySelectorAll('canvas');
		if (!canvases.length) {
			return false; // iets van een foutmelding
		}
		var	newPDF = new jsPDF(),
			imgData
		;
		for (var i=0,cv;cv=canvases[i];i+=1) {
			if (i > 0) {
				newPDF.addPage();
			}
			imgData = cv.toDataURL("image/jpeg");
			newPDF.addImage(imgData, 'JPEG', 15, 40, 180, 180);
		}
		var linkData = {};
		var naamSource = form.querySelector('input[type=text]');
		if (!naamSource.value) {
			naamSource.placeholder = 'Vul aub. een naam in';
			naamSource.focus();
			return false;
		}
		linkData.container = form;
		linkData.naam = naamSource.value;
		linkData.onderwerp = form.dataset.systeemnaam;

		var echtFormulier = $('uploadForm');
		echtFormulier.querySelector('input[type=text]').value = linkData.naam;
		echtFormulier.querySelector('select').value = linkData.onderwerp;
		var data = new FormData(echtFormulier);
		data.append('dossier_document_form[document][file]',newPDF.output('blob'),'document');
		form.querySelector('.spinnerContainer').style.display = 'block'
		sendRequest(location.href,function (req) {
			if (req.status === 201) {
				form.querySelector('.spinnerContainer').style.display = '';
				var resp = JSON.parse(req.response);
				linkData.link = resp.document.url;
				newPDF = null;
				maakLink(linkData);
				// + nieuwe form onder onderwerp
			}
		},data)
		return false;
	}

	function maakLink(data) {
		var div = $('resultaatTemplate').cloneNode(true);
		div.id = '';
		div.querySelector('span').innerHTML = data.onderwerp;
		var link = div.querySelector('a');
		link.href = data.link;
		link.innerHTML = data.naam;
		var form = data.container;
		form.parentNode.insertBefore(div,form);
		form.parentNode.removeChild(form);
	}

	function wijzigActiefFormulier(source) {
		if (actiefFormulier) {
			actiefFormulier.style.display = '';
		}
		var tgt = source.nextElementSibling;
		tgt.style.display = 'block';
		tgt.onderwerp = source.textContent
		actiefFormulier = tgt;
	}
	
	function voegFormulierToe(target) {
	
	}
	
}


function $(id) {
	return document.getElementById(id);
}
/*
	return;
	var actiefFormulier;
	$('nieuwForm').onclick = function () {
		var newForm = $('templateForm').cloneNode(true);
		newForm.id = '';
		newForm.querySelector('.activeer').onclick = function () {
			if (actiefFormulier) {
				actiefFormulier.classList.remove('actief');
			}
			if (actiefFormulier === newForm) {
				actiefFormulier = null;
				return false;
			}
			actiefFormulier = newForm;
			newForm.uploadList = {};
			newForm.classList.add('actief');
			return false;
		}
		newForm.onsubmit = stuurFormulier;
		newForm.querySelector('input[type=file]').required = false;
		$('insertForm').parentNode.insertBefore(newForm,$('insertForm'))
	}
	$('nieuwForm').onclick();
*/

