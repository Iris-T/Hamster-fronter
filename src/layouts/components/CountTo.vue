<template>
    {{ d.num.toFixed(0) }}
</template>
<script setup>
import { reactive, watch } from "vue";
import gsap from "gsap";

const props = defineProps({
    value: {
        typr: Number,
        default: 0
    }
})

const d = reactive({
    num: 0,
})

function AnimatoValue() {
    // 0.5s滚动增加到指定数值
    gsap.to(d, {
        duration: 0.6,
        num: props.value
    })
}
AnimatoValue()
watch(()=>props.value, ()=>AnimatoValue())
</script>