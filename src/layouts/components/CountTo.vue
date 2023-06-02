<template>
    {{ d.isDecimal
        ? Intl.NumberFormat("zh-CN", {
            style: "currency", // 货币形式
            currency: "CNY", // "CNY"是人民币
            currencyDisplay: "symbol", // 默认“symbol”，中文中代表“¥”符号
            useGrouping: true, // 是否使用分组分隔符，如千位分隔符或千/万/亿分隔符，默认为true
            // minimumIntegerDigits: 1, // 使用的整数数字的最小数目.可能的值是从1到21,默认值是1
            minimumFractionDigits: 2, // 使用的小数位数的最小数目.可能的值是从 0 到 20
            maximumFractionDigits: decimals, // 使用的小数位数的最大数目。可能的值是从 0 到 20
        }).format(d.num)
        : d.num.toFixed(0) }}
</template>
<script setup>
import { reactive, watch } from "vue";
import gsap from "gsap";

const props = defineProps({
    // 数据
    value: {
        type: Number,
        default: 0
    },
    // 小数位数
    isDecimal: {
        type: Boolean,
        default: false
    }
})

const d = reactive({
    num: 0,
    isDecimal: false
})

function AnimatoValue() {
    // 0.5s滚动增加到指定数值
    gsap.to(d, {
        duration: 0.6,
        num: props.value,
        isDecimal: props.isDecimal
    })
}
AnimatoValue()
watch(() => props.value, () => AnimatoValue())
</script>