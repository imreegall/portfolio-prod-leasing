// текстовая форма для стоимости автомобиля
const autoPriceTextInput = document.querySelector('#costForm')

// ползунок для стоимости автомобиля
const autoPriceRangeInput = document.querySelector('#costRange')

// текстовая форма для первоначального взноса
const firstPayTextInput = document.querySelector('#firstPayForm')

// блок для отображения знака валюты после текста в форме для первоначального взноса
const firstPayRouble = document.querySelector('.firstPayFormChild')

// ползунок для первоначального взноса
const firstPayRangeInput = document.querySelector('#firstPayRange')

// блок для отображения процента по первоначальному взносу
const firstPayPercent = document.querySelector('.formOpt')

// текстовая форма для срока лизинга
const dateTextInput = document.querySelector('#dateForm')

// ползунок для срока лизинга
const dateRangeInput = document.querySelector('#dateRange')

// блок для отображения суммы договора
const finalSum = document.querySelector('.sumValue')

// блок для отображения ежемесячного платежа
const monthlyPay = document.querySelector('.monthlyPayValue')

// процентная ставка по лизингу
const MonthlyPercent = 0.035

// разделить число на разделы
function splitNumber(value) {
    return onlyCiferNumber(value)
      .toLocaleString()
}

// убрать пробелы из числа
function onlyCiferNumber(string) {
    return Number(string.toString().replace(/[^0-9]/g, ""))
}

//проверить, не вылез ли знак валюты в форме первоначального взноса
function checkRouble() {
    if (firstPayRouble.clientWidth > firstPayRouble.parentElement.clientWidth) {
        firstPayRouble.classList.add('opacity')
    }
    else {
        firstPayRouble.classList.remove('opacity')
    }
}

function dispatchEventForElem(elem, eventType) {
    const event = new Event(eventType)
    elem.dispatchEvent(event)
}

// генерация стоимости автомобиля
autoPriceTextInput.value = splitNumber(autoPriceRangeInput.value)

// генерация первоначального взноса в рублях и процента
firstPayTextInput.value = splitNumber(Math.round(autoPriceRangeInput.value / 100 * firstPayRangeInput.value))
firstPayRouble.innerHTML = firstPayTextInput.value
checkRouble()
firstPayPercent.innerHTML = '<h4>' + firstPayRangeInput.value + '</h4>'

//проверять, вылез ли знак валюты при изменении ширины экрана
document.addEventListener("DOMContentLoaded", function(event)
{
    window.onresize = function() {
        checkRouble()
    };
});

// ежемесячный платеж и сумма договора
let monthlyPayVar
let finalSumVar

// подсчет ежемесячного платежа и суммы договора
function refreshMonthlyPay() {
    // подсчет ежемесячного платежа
    monthlyPayVar = Math.round((autoPriceRangeInput.value - (autoPriceRangeInput.value / 100 * firstPayRangeInput.value)) * ((MonthlyPercent * Math.pow(1 + MonthlyPercent, dateRangeInput.value)) / (Math.pow(1 + MonthlyPercent, dateRangeInput.value) - 1)))
    monthlyPay.innerHTML = '<h2>' + splitNumber(monthlyPayVar) + ' ₽' + '</h2>'

    // подсчет суммы договора
    finalSumVar = Math.round(autoPriceRangeInput.value / 100 * firstPayRangeInput.value) + monthlyPayVar * dateRangeInput.value
    finalSum.innerHTML = '<h2>' + splitNumber(finalSumVar) + ' ₽' + '</h2>'
}

// первоначальная генерация суммы договора и ежемесячного платежа
refreshMonthlyPay()

// изменение стоимости автомобиля с помощью ползунка
autoPriceRangeInput.addEventListener('input', function() {
    // синхронизация с формой
    autoPriceTextInput.value = splitNumber(this.value)

    // обновление первоначального взноса
    firstPayTextInput.value = splitNumber(Math.round(autoPriceRangeInput.value / 100 * firstPayRangeInput.value))
    firstPayRouble.innerHTML = firstPayTextInput.value
    checkRouble()

    // обновление ежемесячного платежа и суммы договора
    refreshMonthlyPay()
})

// изменение стоимости автомобиля с помощью формы (input)
autoPriceTextInput.addEventListener('input', function() {
    // разделение числа по разрядам
    this.value = splitNumber(this.value)

    // стоимость без пробелов
    const cost = onlyCiferNumber(this.value)

    // проверка значения с допустимым диапазоном
    if (cost >= 1000000 && cost <= 6000000) {
        // синхронизация с ползунком
        autoPriceRangeInput.value = cost
        refreshRangeInputStyle(autoPriceRangeInput)

        // обновление первоначального платежа
        firstPayTextInput.value = splitNumber(Math.round(autoPriceRangeInput.value / 100 * firstPayRangeInput.value))
        firstPayRouble.innerHTML = firstPayTextInput.value
        checkRouble()

        // обновление ежемесячного платежа и суммы договора
        refreshMonthlyPay()
    }
})

// изменение стоимости автомобиля с помощью формы (change)
autoPriceTextInput.addEventListener('blur', function() {
    // проверка значения с допустимым диапазоном
    this.value = splitNumber(Math.min(Math.max(onlyCiferNumber(this.value), 1000000), 6000000))

    //имитируем событие для обновления всех форм
    dispatchEventForElem(this, 'input')
})

// изменение первоначального взноса с помощью ползунка
firstPayRangeInput.addEventListener('input', function() {
    // синхронизация с формой и блоком с процентами
    firstPayTextInput.value = splitNumber(Math.round(autoPriceRangeInput.value / 100 * this.value))
    firstPayRouble.innerHTML = firstPayTextInput.value
    checkRouble()
    firstPayPercent.innerHTML = '<h4>' + this.value + '</h4>'

    // обновление ежемесячного платежа и суммы договора
    refreshMonthlyPay()
})

// изменение первоначального взноса с помощью формы (input)
firstPayTextInput.addEventListener('input', function() {
    // разделение числа по разрядам
    this.value = splitNumber(this.value)

    // синхронизация с блоком для отображения валюты
    firstPayRouble.innerHTML = this.value
    checkRouble()

    // первоначальный взнос без пробелов
    const initial = onlyCiferNumber(this.value)

    // границы допустимых значений первоначального взноса
    const minInitial = autoPriceRangeInput.value * 0.1
    const maxInitial = autoPriceRangeInput.value * 0.6


    // проверка значения с допустимым диапазоном
    if (initial >= minInitial && initial <= maxInitial) {
        // синхронизация с ползунком и блоком с процентами
        firstPayRangeInput.value = Math.round(initial / (autoPriceRangeInput.value / 100))
        refreshRangeInputStyle(firstPayRangeInput)
        firstPayPercent.innerHTML = '<h4>' + firstPayRangeInput.value.toString() + '</h4>'
    
        // обновление ежемесячного платежа и суммы договора
        refreshMonthlyPay()
    }
})

// изменение первоначального взноса с помощью формы (change)
firstPayTextInput.addEventListener('blur', function() {
    // проверка значения с допустимым диапазоном
    this.value = splitNumber(Math.round(
        Math.min(
            Math.max(onlyCiferNumber(this.value), autoPriceRangeInput.value * 0.1),
            autoPriceRangeInput.value * 0.6)))

    //имитируем событие для обновления всех форм
    dispatchEventForElem(this, 'input')
})

// изменение срока лизинга с помощью ползунка
dateRangeInput.addEventListener('input', function() {
    // синхронизация с формой
    dateTextInput.value = this.value

    // обновление ежемесячного платежа и суммы договора
    refreshMonthlyPay()
})

// изменение срока лизинга с помощью формы (input)
dateTextInput.addEventListener('input', function() {
    // разделение числа по разрядам
    this.value = splitNumber(this.value)

    // первоначальный взнос без пробелов
    const date = onlyCiferNumber(this.value)

    // проверка значения с допустимым диапазоном
    if (date >= 1 && date <= 60) {
        // синхронизация с ползунком
        dateRangeInput.value = date
        refreshRangeInputStyle(dateRangeInput)
    
        // обновление ежемесячного платежа и суммы договора
        refreshMonthlyPay()
    }
})

// изменение срока лизинга с помощью формы
dateTextInput.addEventListener('blur', function() {
    // проверка значения с допустимым диапазоном
    this.value = Math.min(Math.max(onlyCiferNumber(this.value), 1), 60)

    //имитируем событие для обновления всех форм
    dispatchEventForElem(this, 'input')
})



// все ползунки
const rangeInputs = document.querySelectorAll('input[type=range]')

// обновление заднего фона у конкретного ползунка
function refreshRangeInputStyle(input) {
    input.style.backgroundSize = (input.value - input.min) * 100 / (input.max - input.min) + '% 100%'
}

// обновление заднего фона у ползунков при их использовании
rangeInputs.forEach(input => {
    input.addEventListener('input', function(e) {
        let target = e.target
        const min = target.min
        const max = target.max
        const val = target.value

        target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%'
    })

    refreshRangeInputStyle(input)
})


// все текстовые формы
const textInputs = document.querySelectorAll('input[type=text]')

// изменение фона формы и фона кнопки при фокусе и блюре на форму
textInputs.forEach(input => {
    input.onfocus = function() {
        this.closest('.form').style.backgroundColor = "rgba(255, 255, 255, 0)"
        button.style.opacity = '.4'
        button.classList.remove('activeButton')
    }

    input.onblur = function() {
        this.closest('.form').style.backgroundColor = "#F3F3F4"
        button.style.opacity = '1'
        button.classList.add('activeButton')
    }
})


// кнопка
const button = document.querySelector('#sendInfo')

// все формы (text, range)
const allInputs = document.querySelectorAll('input')

// все, что должно быть opacity при нажатии кнопки
const opacityElements = document.querySelectorAll('.form,.rangeCont')

// создание объекта для передачи его backend
function createObj() {
    let leasingInfo = {
        "autoCost" : autoPriceRangeInput.value,
        "firstPayPercent" : firstPayRangeInput.value,
        "dateLeasing" : dateRangeInput.value,
        "monthlyPay" : monthlyPayVar,
        "finallySum" : finalSumVar
    }

    // преобразование объекта к JSON формату
    return JSON.stringify(leasingInfo)
}

// клик по кнопке
button.onclick = function() {
    // блокирование кнопки
    button.classList.remove('activeButton')
    button.classList.add('loadingButton')

    // блокирование всех форм
    allInputs.forEach(input => {
        input.setAttribute('disabled', 'disabled')
    })

    // создание прозрачности для блоков форм
    opacityElements.forEach(elem => {
        elem.classList.add('opacity')
    })
    firstPayTextInput.classList.add('opacity')

    // имитация ответа от backend
    setTimeout(() => {
        // разблокирование кнопки
        button.classList.remove('loadingButton')
        button.classList.add('activeButton')

        // разблокирование всех форм
        allInputs.forEach(input => {
            input.removeAttribute('disabled')
        })

        // снятие прозрачности для блоков форм
        opacityElements.forEach(elem => {
            elem.classList.remove('opacity')
        })
        firstPayTextInput.classList.remove('opacity')

        // имитация передачи информации в backend
        setTimeout(() => {
            alert(createObj())
        }, 100)
    }, 1000)
}