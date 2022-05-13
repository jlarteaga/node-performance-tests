# node-performance-tests

## Performance comparison of loops in big arrays

```shell
$ yarn install && yarn test-loops
```

```shell
┌─────────┬─────────────────┬─────────┐
│ (index) │   alternative   │ isValid │
├─────────┼─────────────────┼─────────┤
│    0    │  'regular-for'  │  true   │
│    1    │ 'optimized-for' │  true   │
│    2    │ 'reversed-for'  │  true   │
│    3    │    'for-of'     │  true   │
│    4    │    'forEach'    │  true   │
└─────────┴─────────────────┴─────────┘
Better avg time (array.length=300000, 1000 iterations each)
┌─────────┬─────────────────┬─────────────────────┬─────────────────────┬────────────────────┬───────────────────────┐
│ (index) │   alternative   │    avg time (ms)    │    min time (ms)    │   max time (ms)    │ how slow against best │
├─────────┼─────────────────┼─────────────────────┼─────────────────────┼────────────────────┼───────────────────────┤
│    0    │  'regular-for'  │ 0.28653191693872215 │ 0.27379000186920166 │ 0.9912950024008751 │        '0.00%'        │
│    1    │ 'reversed-for'  │ 0.2902331359833479  │ 0.27995799481868744 │ 1.0796849951148033 │        '1.29%'        │
│    2    │ 'optimized-for' │ 0.30385086722671983 │ 0.27993500232696533 │  1.0720139965415   │        '6.04%'        │
│    3    │    'for-of'     │ 0.3057040608897805  │ 0.27994800359010696 │ 3.013112999498844  │        '6.69%'        │
│    4    │    'forEach'    │ 2.6961149630397556  │  2.342778004705906  │ 3.462535999715328  │       '840.95%'       │
└─────────┴─────────────────┴─────────────────────┴─────────────────────┴────────────────────┴───────────────────────┘
```

## Incremental comparison of performance in loops

```shell
$ yarn install && yarn test-loops-incremental && yarn test-loops-incremental-chart 
```
**0-100**
![stats_0-100](https://user-images.githubusercontent.com/6887018/168231519-1180cdec-f2dc-4f94-b2d6-cced360180a2.svg)
**100-5,000**
![stats_100-5000](https://user-images.githubusercontent.com/6887018/168231600-3aad6eda-7304-4b05-b473-b7facdb07053.svg)
**5,000-100,000**
![stats_5000-100000](https://user-images.githubusercontent.com/6887018/168231623-d7b73da0-57d5-45d6-bf3d-1c5021d52fbb.svg)
**100,000-1,000,000**
![stats_100000-1000000](https://user-images.githubusercontent.com/6887018/168231639-73df0763-903a-4af7-a6f8-12df5e56d7ae.svg)
**0-1,000,000**
![stats_0-1000000](https://user-images.githubusercontent.com/6887018/168231908-ee682ccd-fc82-4cef-8ec5-34c77cc918dd.svg)



