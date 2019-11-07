import order  from '@/api/orders'
import {Card, Cell, CellGroup, Checkbox, CheckboxGroup, NavBar, SubmitBar, Tabbar, TabbarItem, Toast} from 'vant';

export default {
    components: {
        [Card.name]: Card,
        [Checkbox.name]: Checkbox,
        [SubmitBar.name]: SubmitBar,
        [CheckboxGroup.name]: CheckboxGroup,
        [NavBar.name]: NavBar,
        [Tabbar.name]: Tabbar,
        [TabbarItem.name]: TabbarItem,
        [Cell.name]: Cell,
        [CellGroup.name]: CellGroup
    },

    data() {
        return {
            activeFooter: 2,
            checkedGoods: [],
            checkeAllCarts: [],
            cartList: [],
            checkedAll: true,
            addr: undefined
        };
    },
    mounted() {
        this.init()
    },
    computed: {
        addrText(){
          if(this.addr){
              return this.addr.name+'('+this.addr.tel+')'
          }else{
              return ''
          }
        },
        submitBarText() {
            const count = this.checkedGoods.length;
            return '提交订单' + (count ? `(${count})` : '')
        },
        totalPrice() {
            return this.cartList.reduce((total, item) => total + (this.checkedGoods.indexOf(item.id) !== -1 ? (parseFloat(item.goods.price) * item.count) : 0), 0)
        }
    },

    methods: {
        init() {
            order.prepareCheckout().then(response => {
                let cartList = response.data.list
                this.addr = response.data.addr
                for (var index in cartList) {
                    cartList[index].thumb = '/dev-api/file/getImgStream?idFile=' + cartList[index].goods.pic
                    this.checkedGoods.push(cartList[index].id + '')
                }
                this.cartList = cartList
            }).catch((err) => {
                Toast(err)
            })
        },
        submit() {
            Toast('点击结算');
        },
        formatPrice(price) {
            return (price / 100).toFixed(2);
        },
        stepperEvent(item, arg) {
            let count = arg[0];
            console.log('id', item.id)
            console.log('num', count)
            cart.update({id: item.id, count: count})
        },
        checkAll() {
            if (this.checkedGoods.length === this.cartList.length) {
                this.checkeAllCarts = this.checkedGoods
                this.checkedGoods = []
            } else {
                this.checkedGoods = this.checkeAllCarts
            }
        },
    }
};