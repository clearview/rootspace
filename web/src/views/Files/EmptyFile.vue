<template>
  <div class="empty-file">
    <div class="content">
      <img src="@/assets/images/file-empty.svg" alt="Empty File" class="illustration">
      <h3 class="title">
        Add your first file
      </h3>
      <h4 class="subtitle">
        You can drag and drop or click on the button below
      </h4>
      <div class="actions">
        <button class="btn btn-upload">
          <legacy-icon class="icon is-left" name="plus" size="1.3em" viewbox="32"/>
          Upload File
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {

}
</script>

<style lang="postcss" scoped>
.empty-file {
  @apply flex items-center justify-center;
  height: calc(100vh - 44px);
  display: flex;
  flex-direction: column;
}
.content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1 1 auto;
}
.title {
  margin-top: 56.53px;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 21px;
  text-align: center;
  color: #2C2B35;
}
.subtitle {
  margin-top: 9px;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 16.71px;
  text-align: center;
  color: #2C2B35;
}
.actions {
  margin-top: 24px;
  .btn-upload {
    border-color: #8CD5FF;
    background: #8CD5FF;
    color: #2C2B35;
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
