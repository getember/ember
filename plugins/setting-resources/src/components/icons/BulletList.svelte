<!--
// Copyright © 2024 Digitrans Inc.
//
// Licensed under the Eclipse Public License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License. You may
// obtain a copy of the License at https://www.eclipse.org/legal/epl-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//
// See the License for the specific language governing permissions and
// limitations under the License.
-->
<script lang="ts">
  export let size: 'small' | 'medium' | 'large'
  const fill: string = 'currentColor'
</script>

<svg class="svg-{size}" {fill} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 9C5.10457 9 6 8.10457 6 7C6 5.89543 5.10457 5 4 5C2.89543 5 2 5.89543 2 7C2 8.10457 2.89543 9 4 9Z" />
  <path
    d="M9 7C9 6.44772 9.44772 6 10 6H29C29.5523 6 30 6.44772 30 7C30 7.55228 29.5523 8 29 8H10C9.44772 8 9 7.55228 9 7Z"
  />
  <path
    d="M9 16C9 15.4477 9.44772 15 10 15H29C29.5523 15 30 15.4477 30 16C30 16.5523 29.5523 17 29 17H10C9.44772 17 9 16.5523 9 16Z"
  />
  <path
    d="M10 24C9.44772 24 9 24.4477 9 25C9 25.5523 9.44772 26 10 26H29C29.5523 26 30 25.5523 30 25C30 24.4477 29.5523 24 29 24H10Z"
  />
  <path
    d="M6 16C6 17.1046 5.10457 18 4 18C2.89543 18 2 17.1046 2 16C2 14.8954 2.89543 14 4 14C5.10457 14 6 14.8954 6 16Z"
  />
  <path
    d="M4 27C5.10457 27 6 26.1046 6 25C6 23.8954 5.10457 23 4 23C2.89543 23 2 23.8954 2 25C2 26.1046 2.89543 27 4 27Z"
  />
</svg>
