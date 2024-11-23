let basePath = 'http://localhost:3000'
let url = new URL(window.location.href)

// status
document.addEventListener('DOMContentLoaded', () => {
    const allButton = document.querySelectorAll('button[data-status]')

    allButton.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const status = e.target.dataset.status
            allButton.forEach((btn) => btn.classList.remove('active'))

            if (status) {
                url.searchParams.set('status', status)
            } else {
                url.searchParams.delete('status')
            }
            window.location.href = url.href
            // e.target.classList.add('active')
        })
    })
    // end stattus

    // search
    const btnSearch = document.querySelector('.btn-search')
    const inputSearch = document.querySelector('input[name="keyword"]')
    if (btnSearch) {
        btnSearch.addEventListener('click', (e) => {
            e.preventDefault()
            const keywords = inputSearch.value

            if (keywords !== '') {
                url.searchParams.set('keywords', keywords)
            } else {
                url.searchParams.delete('keywords')
            }
            window.location.href = url.href
        })
    }

    const btnClose = document.querySelector('.btn-close')
    if (btnClose) {
        btnClose.addEventListener('click', () => {
            url.searchParams.delete('keywords')
            window.location.href = url.href
        })
    }

    // end search

    // update status
    const allLinkStatus = document.querySelectorAll('.badge[data-change]')
    const formChangeStatus = document.forms['changeStatusForm']
    allLinkStatus.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault()
            const id = link.getAttribute('data-index')
            const crrStatus = link.getAttribute('data-change')
            const location = url.href.split('?')
            formChangeStatus.action = `${location[0]}/${crrStatus}/${id}?_method=PATCH&${location[1]}`
            formChangeStatus.submit()
        })
    })

    // end update status

    // selected checkbox product

    const checkAll = document.querySelector('#checkbox-all')
    const checkboxProduct = document.querySelectorAll('input.check-product')

    const inputIds = document.querySelector('input.all-id')
    if (checkAll) {
        checkAll.addEventListener('change', () => {
            checkboxProduct.forEach((item) => (item.checked = checkAll.checked))
            const itemCheked = document.querySelectorAll('input.check-product:checked')
            getIds(itemCheked)
        })
    }

    checkboxProduct.forEach((item) => {
        item.addEventListener('change', () => {
            const itemCheked = document.querySelectorAll('input.check-product:checked')
            getIds(itemCheked)
            checkAll.checked = itemCheked.length === checkboxProduct.length ? true : false
        })
    })

    function getIds(itemCheked) {
        if (itemCheked) {
            inputIds.value = ''
            itemCheked.forEach((ele) => {
                if (!inputIds.value.includes(ele.value)) {
                    inputIds.value += `${ele.value},`
                }
            })
        }
        // console.log(inputIds.value)
    }

    const btnChangeMulti = document.querySelector('button[btn-change-multi-type]')
    if (btnChangeMulti) {
        btnChangeMulti.addEventListener('click', async () => {
            const type = document.querySelector('#inputGroupSelect04').value
            if (type === '' || inputIds.value === '') return

            const res = await fetch(basePath + '/admin/products/change-multi-type', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: inputIds.value, type }),
            })
            const data = await res.json()
            if (data.message === 'ok') window.location.reload()
        })
    }
    // end  selected checkbox product

    // delete one product
    const allButtonDelete = document.querySelectorAll('span[btn-delete-one]')
    allButtonDelete.forEach((btn) => {
        btn.addEventListener('click', async () => {
            const isConfirm = window.confirm('Bạn có muốn xóa sản phẩm không ?')
            if (isConfirm) {
                const id = btn.closest('tr').dataset.id

                const res = await fetch(`${basePath}/admin/products/delete/${id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                })
                const result = await res.json()
                if (result.success) {
                    location.reload()
                }
            }
        })
    })
    // delete one product

    // Edit product
    // const allButtonEdit = document.querySelectorAll('span[btn-edit-one]')
    // allButtonEdit.forEach((btnEdit) => {
    //     btnEdit.addEventListener('click', () => {
    //         const id = btn.closest('tr').dataset.id
    //     })
    // })
    // END Edit product
    setTimeout(() => {
        document.querySelector('.msg-box')?.remove()
    }, 3000)

    // change-position
    const inputPositions = document.querySelectorAll('input[change-position]')
    if (inputPositions) {
        inputPositions.forEach((input) => {
            input.addEventListener('change', async () => {
                const id = input.closest('tr').dataset.id
                const value = input.value
                // fetch

                const res = await fetch(`${basePath}/admin/products/changePosition/${id}/${value}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                })

                const result = await res.json()
                if (result.success) {
                    location.reload()
                }
            })
        })
    }

    // END change-position

    // preview -image
    const imgThumbnail = document.querySelector('input#thumbnail')
    const imgPre = document.querySelector('img.image-preview')
    if (imgThumbnail) {
        imgThumbnail.addEventListener('change', (e) => {
            if (e.target.files[0]) {
                const pathImage = URL.createObjectURL(e.target.files[0])
                imgPre.src = pathImage
            }
        })
    }
    // END preview -image
})
