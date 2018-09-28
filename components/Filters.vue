<template>
    <div class="filter">
        <label>{{ label }}</label>
        <ul>
            <li v-for="option in options" @click="filter(option)" class="filter_item" v-bind:class="isActiveFilter(option)">
                {{ option.name }}
            </li>
        </ul>
    </div>
</template>

<script>
    export default {

        data() {
            return {
                selectedItemData: null
            }
        },

        props: {
            label: String,
            options: {
                type: [Array, Object]
            },
            selectedProp: { 
                type: Object, 
                default() { return { value: 'all' }}
            },
        },

        computed: {
            selectedItem: {
                get: function () {
                    return this.selectedItemData || this.selectedProp
                },
                set: function (newValue) {
                    this.selectedItemData = newValue
                }
            }
        },

        methods: {

            filter(option) {
                this.selectedItem = option
                this.$emit('updateOption', this.selectedItem)
            },
            isActiveFilter( option ) {
                return {
                    'active_filter': option.value === this.selectedItem.value
                }
            } 
        }
    }
</script>
