<script lang="ts">
  import { onMount } from 'svelte'
  import { createEventDispatcher, tick } from 'svelte'

  export let variant: 'default' | 'light' = 'default'
  export let id: string | null = null
  export let name: string | null = null
  export let rows = 4
  export let value: string | number | null = null
  export let autocomplete: string | null = null
  export let placeholder: string | null = null
  export let resizable = false
  export let disabled = false
  export let invalid = false
  export { className as class }

  const dispatch = createEventDispatcher()
  const dispatchOnMount = createEventDispatcher<{
    mount: HTMLTextAreaElement
  }>()

  let textArea: HTMLTextAreaElement
  let textAreaHeight = 0
  let className = ''

  const resize = async () => {
    if (!resizable) return

    textAreaHeight = 0
    await tick()
    textAreaHeight = textArea.scrollHeight
    console.log(textArea)
    console.log(textArea.scrollHeight)
  }

  const onInput = (e: Event) => {
    resize()
    dispatch('input', e)
  }

  onMount(() => {
    resize()
    dispatchOnMount('mount', textArea)
  })
</script>

<textarea
  {id}
  {name}
  {rows}
  {autocomplete}
  {placeholder}
  {disabled}
  class="{className} textarea-{variant}"
  class:invalid
  style="height: {resizable ? `${textAreaHeight}px` : 'auto'};"
  bind:this={textArea}
  bind:value
  on:input={onInput}
/>

<style lang="scss">
  textarea {
    width: 100%;
    padding: 8px 15px;
    border: 1px solid $color-border;
    border-radius: 3px;
    outline: none;
    word-break: break-all;

    &.textarea-default {
      background-color: $color-background;
    }

    &.textarea-light {
      background-color: $color-white;
    }

    &:disabled {
      opacity: 0.5;
    }

    &.invalid {
      border-color: $color-error;
    }

    &::placeholder {
      color: $color-gray;
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }
</style>
