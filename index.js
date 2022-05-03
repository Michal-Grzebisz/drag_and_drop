const inputMultiFiles = document.querySelector('.files');
const list = document.querySelector('.files_list');
const dropArea = document.querySelector('.droparea');

const ConvertDMSToDD = (degrees, minutes, seconds, direction) => {
    
  const dd = degrees + (minutes/60) + (seconds/3600);
  
  if (direction == 'S' || direction == 'W') {
      dd = dd * -1; 
  }
  
  return dd;
}

const getFileInfo = (file, element, fileSize) => {
  const fileName = file.name
  EXIF.getData(file, function() {
    const data = EXIF.getAllTags(this)
    const listSpan = document.createElement('span')
    const listLocationPar = document.createElement('p')
    if (data.GPSLatitude && data.GPSLongitude) {
      const latDegree = data.GPSLatitude[0].numerator / data.GPSLatitude[0].denominator;
      const latMinute = data.GPSLatitude[1].numerator / data.GPSLatitude[1].denominator;
      const latSecond = (data.GPSLatitude[2].numerator / data.GPSLatitude[2].denominator).toFixed(2);
      const latDirection = data.GPSLatitudeRef;
      const latFinal = ConvertDMSToDD(latDegree, latMinute, latSecond, latDirection)
      const lonDegree = data.GPSLongitude[0].numerator / data.GPSLongitude[0].denominator;
      const lonMinute = data.GPSLongitude[1].numerator / data.GPSLongitude[1].denominator;
      const lonSecond = (data.GPSLongitude[2].numerator / data.GPSLongitude[2].denominator).toFixed(2);
      const lonDirection = data.GPSLongitudeRef;
      const lonFinal = ConvertDMSToDD(lonDegree, lonMinute, lonSecond, lonDirection);
      const location = `${latFinal.toFixed(4)}° ${latDirection} ${lonFinal.toFixed(4)}° ${lonDirection}`
      listLocationPar.classList.add('location')
      listLocationPar.textContent = location
      listSpan.appendChild(listLocationPar)
    }
    
    if (!data.GPSLatitude && !data.GPSLongitude) {
      listLocationPar.textContent = 'Do not contain GPS cordination'
      listLocationPar.classList.add('location_error')
      listSpan.appendChild(listLocationPar)
    }

    const listNamePar = document.createElement('p')
    const listFileSizePar = document.createElement('p')
    listNamePar.classList.add('name')
    listFileSizePar.classList.add('size')
    listSpan.classList.add('li_span');
    listNamePar.textContent = fileName
    listFileSizePar.textContent = `(${fileSize}MB)`
    listSpan.appendChild(listNamePar)
    listSpan.appendChild(listFileSizePar)
    return element.appendChild(listSpan)
  });
}

const listItem = (file) => {
  const fileSize = (file.size / 1024 / 1024).toFixed(2)
  const itemLi = document.createElement('li');

  if (fileSize > 1) {
    alert('File size exceeds 1 MB');
    inputMultiFiles.value = null
  } else {
  const reader = new FileReader()
  reader.readAsDataURL(file);
  reader.addEventListener('load', () => {
    const src = reader.result
    const thumbnail = document.createElement('img')
    thumbnail.src = src
    itemLi.appendChild(thumbnail)
  })
  
    getFileInfo(file, itemLi, fileSize)
    const removeButton = document.createElement('button');
    const iconButton = `<i class="fa fa-trash">`
    removeButton.insertAdjacentHTML('afterbegin', iconButton)
    removeButton.addEventListener('click', () => {
      removeButton.parentElement.remove()
    });
    itemLi.appendChild(removeButton);
    list.appendChild(itemLi);
    return itemLi
  }
}

inputMultiFiles.addEventListener('change', (e) => {
  const numFiles = e.currentTarget.files
  const filesArray = Array.from(numFiles)

  filesArray.map(item => {
    listItem(item)  
  })

})

const handleDrop = (e) => {
  const dt = e.dataTransfer;
  const files = dt.files;
  const fileArray = [...files];
  fileArray.map(item => {
    listItem(item) 
  })
}


const dragAndDrop = () => {
  const dropArea = document.querySelector('.droparea');
  const active = () => dropArea.classList.add('black_background');
  const inactive = () => dropArea.classList.remove('black_background');
  const prevents = (e) => e.preventDefault();

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evtName => {
      dropArea.addEventListener(evtName, prevents);
  });

  ['dragenter', 'dragover'].forEach(evtName => {
      dropArea.addEventListener(evtName, active);
  });

  ['dragleave', 'drop'].forEach(evtName => {
      dropArea.addEventListener(evtName, inactive);
  });

  dropArea.addEventListener('drop', handleDrop);
}



document.addEventListener('DOMContentLoaded', dragAndDrop);
